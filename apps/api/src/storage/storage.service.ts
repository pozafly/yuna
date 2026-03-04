import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as Minio from 'minio';
import { BabyMembership } from '../entities';
import { Role, MembershipStatus } from '@yuna/shared-types';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  private bucketOriginals: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minio_admin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minio_secret'),
    });
    this.bucketOriginals = this.configService.get(
      'MINIO_BUCKET_ORIGINALS',
      'originals',
    );
  }

  /** Presigned PUT URL 발급 (업로드용, OWNER만) */
  async getPresignedPutUrl(
    userId: string,
    babyId: string,
    fileName: string,
  ) {
    const membership = await this.membershipRepo.findOne({
      where: {
        babyId,
        userId,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    });
    if (!membership) {
      throw new ForbiddenException('OWNER만 업로드할 수 있습니다');
    }

    const ext = fileName.split('.').pop() || 'jpg';
    const key = `${babyId}/${uuidv4()}.${ext}`;

    const url = await this.minioClient.presignedPutObject(
      this.bucketOriginals,
      key,
      5 * 60, // 5분 TTL
    );

    return { url, key };
  }

  /** Presigned GET URL 발급 (조회용, 멤버만) */
  async getPresignedGetUrl(userId: string, babyId: string, key: string) {
    const membership = await this.membershipRepo.findOne({
      where: { babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }

    const url = await this.minioClient.presignedGetObject(
      this.bucketOriginals,
      key,
      5 * 60,
    );

    return { url };
  }

  /** Presigned GET URL 생성 (내부용, 권한 체크 없음 — 호출자가 권한 검증 완료한 경우) */
  async generateGetUrl(key: string): Promise<string> {
    return this.minioClient.presignedGetObject(
      this.bucketOriginals,
      key,
      5 * 60, // 5분 TTL
    );
  }
}
