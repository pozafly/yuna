import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '../common/authz/authorization.service';

@Injectable()
export class StorageService {
  constructor(private readonly authz: AuthorizationService) {}

  async issuePresignedGet(userId: string, babyId: string, objectKey: string) {
    await this.authz.assertCanAccessBaby(userId, babyId);

    // 현재는 MinIO 연동 전 단계라 presigned URL 형식을 모사합니다.
    // 실 구현에서는 MinIO SDK의 presignedGetObject 결과로 치환하면 됩니다.
    return {
      url: `https://minio.local/presigned-get/${encodeURIComponent(objectKey)}?expiresIn=300`,
      expiresIn: 300
    };
  }

  async issuePresignedPut(
    userId: string,
    babyId: string,
    postId: string,
    extension = 'jpg'
  ) {
    await this.authz.assertOwner(userId, babyId);

    const key = `originals/${babyId}/${postId}/${crypto.randomUUID()}.${extension}`;

    return {
      key,
      url: `https://minio.local/presigned-put/${encodeURIComponent(key)}?expiresIn=300`,
      expiresIn: 300
    };
  }
}
