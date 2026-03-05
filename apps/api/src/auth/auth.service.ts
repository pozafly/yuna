import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Invitation,
  BabyMembership,
  Baby,
  Post,
  PostMedia,
  Letter,
  Comment,
} from '../entities';
import * as Minio from 'minio';
import {
  InvitationStatus,
  UserStatus,
  Role,
  MembershipStatus,
  BabyStatus,
  Visibility,
  TargetType,
} from '@yuna/shared-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
    @InjectRepository(Baby)
    private readonly babyRepo: Repository<Baby>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostMedia)
    private readonly mediaRepo: Repository<PostMedia>,
    @InjectRepository(Letter) private readonly letterRepo: Repository<Letter>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // MinIO 클라이언트 (시드 이미지 업로드용)
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minio_admin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minio_secret'),
    });
    this.minioBucket = this.configService.get(
      'MINIO_BUCKET_ORIGINALS',
      'originals',
    );
  }

  private readonly minioClient: Minio.Client;
  private readonly minioBucket: string;

  /** 매직링크 발송 (개발환경에서는 console에 출력) */
  async sendMagicLink(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('등록되지 않은 이메일입니다');
    }

    const token = uuidv4();
    const ttlMinutes = parseInt(
      this.configService.get('MAGIC_LINK_TTL', '30m').replace('m', ''),
    );

    // 매직링크를 Invitation 테이블에 저장 (type을 magic-link로 활용)
    // 간단하게 user에 magicLinkToken 컬럼 대신, JWT에 이메일 인코딩
    const magicToken = this.jwtService.sign(
      { email, type: 'magic-link' },
      { expiresIn: `${ttlMinutes}m` },
    );

    const appUrl = this.configService.get('APP_URL', 'http://localhost:3001');
    const link = `${appUrl}/api/auth/magic-link/verify?token=${magicToken}`;

    // 개발환경: 콘솔 출력
    console.log(`\n========== MAGIC LINK ==========`);
    console.log(`Email: ${email}`);
    console.log(`Link: ${link}`);
    console.log(`================================\n`);

    return { message: '매직링크가 발송되었습니다' };
  }

  /** 매직링크 검증 → 세션(토큰) 발급 */
  async verifyMagicLink(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'magic-link') {
        throw new UnauthorizedException('유효하지 않은 토큰입니다');
      }

      const user = await this.userRepo.findOne({
        where: { email: payload.email },
      });
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('유효하지 않은 사용자입니다');
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('만료되었거나 유효하지 않은 링크입니다');
    }
  }

  /** 초대 토큰으로 신규 사용자 등록 */
  async register(name: string, inviteToken: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { token: inviteToken, status: InvitationStatus.PENDING },
    });

    if (!invitation || new Date() > invitation.expiresAt) {
      throw new BadRequestException('유효하지 않거나 만료된 초대입니다');
    }

    // 이미 가입된 사용자인지 확인
    let user = await this.userRepo.findOne({
      where: { email: invitation.inviteeEmail },
    });

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다');
    }

    // 신규 User 생성
    user = this.userRepo.create({
      email: invitation.inviteeEmail,
      name,
      status: UserStatus.ACTIVE,
    });
    await this.userRepo.save(user);

    // BabyMembership 생성 (INVITED 역할)
    const membership = this.membershipRepo.create({
      babyId: invitation.babyId,
      userId: user.id,
      role: Role.INVITED,
      status: MembershipStatus.ACTIVE,
    });
    await this.membershipRepo.save(membership);

    // 초대 상태 업데이트
    invitation.status = InvitationStatus.ACCEPTED;
    await this.invitationRepo.save(invitation);

    return this.issueTokens(user);
  }

  /** 초대 토큰으로 기존 사용자 수락 */
  async acceptInvitation(userId: string, inviteToken: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { token: inviteToken, status: InvitationStatus.PENDING },
    });

    if (!invitation || new Date() > invitation.expiresAt) {
      throw new BadRequestException('유효하지 않거나 만료된 초대입니다');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.email !== invitation.inviteeEmail) {
      throw new BadRequestException('초대 대상이 아닙니다');
    }

    // 이미 멤버인지 확인
    const existing = await this.membershipRepo.findOne({
      where: { babyId: invitation.babyId, userId },
    });
    if (existing) {
      throw new ConflictException('이미 해당 Baby의 멤버입니다');
    }

    const membership = this.membershipRepo.create({
      babyId: invitation.babyId,
      userId,
      role: Role.INVITED,
      status: MembershipStatus.ACTIVE,
    });
    await this.membershipRepo.save(membership);

    invitation.status = InvitationStatus.ACCEPTED;
    await this.invitationRepo.save(invitation);

    return { message: '초대를 수락했습니다' };
  }

  /** refreshToken으로 accessToken 갱신 */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET', 'dev-jwt-secret'),
      });

      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
      });
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException();
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
    }
  }

  /** 현재 사용자 정보 반환 */
  async getMe(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['memberships', 'memberships.baby'],
    });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      babies: user.memberships
        .filter((m) => m.status === MembershipStatus.ACTIVE)
        .map((m) => ({
          id: m.baby.id,
          name: m.baby.name,
          role: m.role,
          birthDate: m.baby.birthDate ?? null,
        })),
    };
  }

  /** 개발 환경 전용: 테스트 유저 자동 생성 + 로그인 */
  async devLogin() {
    const devEmail = 'dev@yuna.app';

    let user = await this.userRepo.findOne({ where: { email: devEmail } });
    if (!user) {
      user = this.userRepo.create({
        email: devEmail,
        name: '개발자',
        status: UserStatus.ACTIVE,
      });
      await this.userRepo.save(user);
    }

    // Baby가 없으면 하나 생성, 있으면 기존 baby를 조회
    let membership = await this.membershipRepo.findOne({
      where: { userId: user.id },
    });
    let baby: Baby;

    if (!membership) {
      // 신규 Baby 생성
      baby = this.babyRepo.create({
        name: '우리 아기',
        gender: null,
        birthDate: '2025-01-01',
        status: BabyStatus.ACTIVE,
      });
      await this.babyRepo.save(baby);

      membership = this.membershipRepo.create({
        babyId: baby.id,
        userId: user.id,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
      });
      await this.membershipRepo.save(membership);
    } else {
      // 기존 Baby 조회 (membership이 존재하므로 반드시 존재해야 함)
      const foundBaby = await this.babyRepo.findOne({
        where: { id: membership.babyId },
      });
      if (!foundBaby) {
        // 데이터 정합성 오류 — 정상적인 상황에서는 발생하지 않음
        return this.issueTokens(user);
      }
      baby = foundBaby;
    }

    // 시드 데이터 생성 (중복 방지 포함)
    await this.seedDevData(user.id, baby.id);

    return this.issueTokens(user);
  }

  /** 개발용 시드 데이터 생성 (Post 12개 + 이미지, Letter 3개, Comment 6개) */
  private async seedDevData(userId: string, babyId: string): Promise<void> {
    // 게시물이 12개 이상이면 시드 데이터가 이미 충분하므로 건너뜀
    const existingCount = await this.postRepo.count({ where: { babyId } });
    if (existingCount >= 12) {
      return;
    }

    // 기존 데이터가 있으면 삭제 후 재생성 (깨끗한 시드)
    if (existingCount > 0) {
      await this.commentRepo.delete({ authorId: userId });
      await this.mediaRepo.delete({});
      await this.postRepo.delete({ babyId });
      await this.letterRepo.delete({ babyId });
    }

    // ──────────────────────────────────────────────
    // 샘플 이미지 다운로드 → MinIO 업로드 헬퍼
    // ──────────────────────────────────────────────
    const uploadSampleImage = async (
      imageUrl: string,
      idx: number,
    ): Promise<string | null> => {
      try {
        const response = await fetch(imageUrl, { redirect: 'follow' });
        if (!response.ok) return null;
        const arrayBuf = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const key = `${babyId}/seed-${idx}-${uuidv4().slice(0, 8)}.jpg`;
        await this.minioClient.putObject(
          this.minioBucket,
          key,
          buffer,
          buffer.length,
          { 'Content-Type': 'image/jpeg' },
        );
        return key;
      } catch {
        return null;
      }
    };

    // 아기/가족 관련 Unsplash 이미지 URL (800x800 크롭)
    const sampleImageUrls = [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop', // 아기 발
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=800&fit=crop', // 아기
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e1?w=800&h=800&fit=crop', // 자는 아기
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=800&fit=crop', // 아기 손
      'https://images.unsplash.com/photo-1578307980342-3f6a70c2dd23?w=800&h=800&fit=crop', // 아기 장난감
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=800&fit=crop', // 아기옷
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop', // 아이
      'https://images.unsplash.com/photo-1565843708714-52ecf69ab81f?w=800&h=800&fit=crop', // 아기 용품
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=800&fit=crop', // 아기 놀이
      'https://images.unsplash.com/photo-1548025600-56e981efca49?w=800&h=800&fit=crop', // 걸음마
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&h=800&fit=crop', // 이유식
      'https://images.unsplash.com/photo-1590099033615-be195f8d575c?w=800&h=800&fit=crop', // 가족
      'https://images.unsplash.com/photo-1586092406795-4c12e2f77984?w=800&h=800&fit=crop', // 아기 목욕
      'https://images.unsplash.com/photo-1566004100477-7b7c7e3d5a3f?w=800&h=800&fit=crop', // 아기 미소
      'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800&h=800&fit=crop', // 가족 산책
      'https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?w=800&h=800&fit=crop', // 아기 방
    ];

    // 모든 이미지를 병렬 다운로드 + 업로드
    const uploadedKeys = await Promise.all(
      sampleImageUrls.map((url, i) => uploadSampleImage(url, i)),
    );
    const validKeys = uploadedKeys.filter((k): k is string => k !== null);

    // ──────────────────────────────────────────────
    // 게시물 12개 생성 (INVITED 10개 + PRIVATE 2개)
    // 각 게시물에 1~3장의 이미지 첨부
    // ──────────────────────────────────────────────
    const postDataList = [
      {
        content:
          '오늘 처음으로 혼자 앉았어요! 작은 등이 꼿꼿하게 서는 순간, 눈물이 왈칵 쏟아졌습니다. 이 소중한 순간을 절대 잊지 못할 것 같아요.',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-03-15T10:30:00'),
        imageCount: 2,
      },
      {
        content:
          '이유식을 처음 먹었는데 온 얼굴에 당근 퓨레를 묻히고는 방긋 웃더라고요. 세상에서 제일 귀여운 장면이었어요 😋',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-04-20T12:00:00'),
        imageCount: 3,
      },
      {
        content:
          '오늘 낮잠 자는 모습이 너무 사랑스러워서 한 시간 동안 그냥 바라봤어요. 작은 손이 볼 옆에 가지런히 놓여 있는 모습이 천사 같았습니다.',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-05-10T14:45:00'),
        imageCount: 1,
      },
      {
        content:
          '드디어 첫 걸음마를 뗐어요! 두 발자국을 내딛고는 엉덩방아를 찧었는데, 울지 않고 씩씩하게 다시 일어나려고 하더라고요 🎉',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-07-01T09:15:00'),
        imageCount: 2,
      },
      {
        content:
          '목욕 시간! 물장구를 치며 까르르 웃는 모습에 저도 같이 웃었어요. 거품 묻은 머리가 포인트 ✨',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-08-05T18:30:00'),
        imageCount: 1,
      },
      {
        content:
          '할머니 댁에 갔더니 할머니를 보자마자 두 팔 벌려 안겨요. 할머니 눈시울이 빨개지셨어요. 세대를 잇는 사랑이란 이런 걸까요.',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-09-12T11:00:00'),
        imageCount: 2,
      },
      {
        content:
          '오늘 놀이터에서 처음으로 미끄럼틀을 혼자 타 봤어요! 무서워하면서도 결국 해냈는데 너무 뿌듯해하는 표정이 잊을 수가 없어요.',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-10-22T15:20:00'),
        imageCount: 3,
      },
      {
        content:
          '첫 생일 파티 준비 중! 돌잡이 세트를 펼쳐놨는데 뭘 잡을까 두근두근... 엄마 아빠는 건강하게만 자라줘도 좋겠어요 🎂',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-11-01T10:00:00'),
        imageCount: 2,
      },
      {
        content:
          '오늘 "엄마" 비슷한 소리를 냈어요! "음마~" 하면서 저를 쳐다보는데... 세상에서 가장 아름다운 단어를 들은 기분이에요 🥺',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-12-03T08:30:00'),
        imageCount: 1,
      },
      {
        content:
          '크리스마스 트리 앞에서 찍은 사진이에요. 반짝반짝 빛나는 트리만큼 우리 아이 눈도 반짝반짝 ✨🎄',
        visibility: Visibility.INVITED,
        takenAt: new Date('2025-12-25T16:00:00'),
        imageCount: 1,
      },
      {
        content:
          '오늘은 아이에게 비밀로 간직하고 싶은 이야기예요. 처음 뱃속에서 움직임을 느꼈던 그 날의 감동을 다시 꺼내 봅니다.',
        visibility: Visibility.PRIVATE,
        takenAt: new Date('2025-02-14T08:00:00'),
        imageCount: 1,
      },
      {
        content:
          '아이가 잠든 새벽, 조용히 일기를 써요. 매일이 기적 같고, 매 순간이 감사해요. 이 마음을 잊지 않게 기록합니다.',
        visibility: Visibility.PRIVATE,
        takenAt: new Date('2026-01-10T02:30:00'),
        imageCount: 0,
      },
    ];

    // 이미지 할당 인덱스 (validKeys에서 순서대로 사용)
    let imageIdx = 0;

    const savedPosts: Post[] = [];
    for (const data of postDataList) {
      const post = this.postRepo.create({
        babyId,
        authorId: userId,
        content: data.content,
        visibility: data.visibility,
        takenAt: data.takenAt,
      });
      const saved = await this.postRepo.save(post);
      savedPosts.push(saved);

      // 이미지 첨부 (validKeys가 있는 만큼만)
      for (let i = 0; i < data.imageCount && imageIdx < validKeys.length; i++) {
        const media = this.mediaRepo.create({
          postId: saved.id,
          storageKey: validKeys[imageIdx],
          order: i,
        });
        await this.mediaRepo.save(media);
        imageIdx++;
      }
    }

    // ──────────────────────────────────────────────
    // 편지 3개 생성 (INVITED 2개 + PRIVATE 1개)
    // ──────────────────────────────────────────────
    const letterDataList = [
      {
        title: '네가 열 살이 되는 날에',
        content:
          '이 편지를 쓰는 지금, 너는 아직 기저귀를 차고 옹알이를 하고 있단다. 10년 후 이 편지를 읽게 될 너는 어떤 아이로 자랐을까? 엄마는 네가 건강하고 웃음 가득한 사람이 되길 바란다.',
        visibility: Visibility.INVITED,
      },
      {
        title: '처음 만난 그날의 이야기',
        content:
          '세상에 나온 지 단 몇 시간 만에 너는 내 손가락을 꼭 쥐었어. 그 작고 따뜻한 손의 감촉이 아직도 생생하다. 우리 가족 모두가 얼마나 기다렸는지 알아주었으면 해.',
        visibility: Visibility.INVITED,
      },
      {
        // PRIVATE 편지 — OWNER만 볼 수 있는 깊은 이야기
        title: '엄마의 솔직한 마음',
        content:
          '너한테 다 말하지 못한 이야기들이 있어. 처음 엄마가 되는 것이 얼마나 무섭고 설레는 일이었는지. 이 편지는 네가 어른이 되었을 때 꼭 읽어줬으면 해.',
        visibility: Visibility.PRIVATE,
      },
    ];

    const savedLetters: Letter[] = [];
    for (const data of letterDataList) {
      const letter = this.letterRepo.create({
        babyId,
        authorId: userId,
        title: data.title,
        content: data.content,
        visibility: data.visibility,
      });
      const saved = await this.letterRepo.save(letter);
      savedLetters.push(saved);
    }

    // ──────────────────────────────────────────────
    // 댓글 6개 생성 — 게시물 4개 + 편지 1개에 분산
    // ──────────────────────────────────────────────
    const commentDataList = [
      // 게시물 0번 (처음 앉은 날)에 댓글 2개
      {
        targetType: TargetType.POST,
        targetId: savedPosts[0].id,
        content:
          '정말 대단해요! 이 순간 함께하지 못해서 아쉽지만 사진으로나마 보니 눈물이 날 것 같아요. 💕',
      },
      {
        targetType: TargetType.POST,
        targetId: savedPosts[0].id,
        content: '우리 아가 이제 혼자 앉았구나! 할머니도 빨리 보고 싶어요.',
      },
      // 게시물 1번 (이유식)에 댓글 1개
      {
        targetType: TargetType.POST,
        targetId: savedPosts[1].id,
        content:
          '표정이 너무 귀여웠겠다ㅎㅎ 처음 이유식 먹던 날의 그 표정은 평생 잊지 못하죠!',
      },
      // 게시물 2번 (낮잠)에 댓글 1개
      {
        targetType: TargetType.POST,
        targetId: savedPosts[2].id,
        content:
          '자는 모습이 천사네요. 이럴 때 영상도 꼭 찍어두세요, 나중에 보물이 돼요!',
      },
      // 게시물 3번 (첫 걸음마)에 댓글 1개
      {
        targetType: TargetType.POST,
        targetId: savedPosts[3].id,
        content:
          '드디어 걸음마를!! 진짜 감격스럽네요. 이제 더 빠르게 커가겠죠? 응원해요!',
      },
      // 편지 0번에 댓글 1개
      {
        targetType: TargetType.LETTER,
        targetId: savedLetters[0].id,
        content:
          '이 편지를 읽고 저도 모르게 눈물이 났어요. 아이가 나중에 이 편지를 읽으면 얼마나 감동받을까요.',
      },
    ];

    for (const data of commentDataList) {
      const comment = this.commentRepo.create({
        targetType: data.targetType,
        targetId: data.targetId,
        authorId: userId,
        content: data.content,
      });
      await this.commentRepo.save(comment);
    }
  }

  /** Access + Refresh 토큰 발급 */
  private issueTokens(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: this.configService.get('JWT_ACCESS_TTL', '15m') },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: this.configService.get('JWT_REFRESH_TTL', '30d') },
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
