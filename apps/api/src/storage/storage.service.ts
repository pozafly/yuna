import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService {
    private minioClient: Minio.Client;
    private logger = new Logger(StorageService.name);
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
        const port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10);
        const useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
        const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minio_admin');
        const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minio_secret');

        this.bucketName = this.configService.get<string>('MINIO_BUCKET_ORIGINALS', 'yuna'); // 단일 버킷 아키텍처 (yuna 버킷 안에 originals 폴더 등)

        this.minioClient = new Minio.Client({
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
        });
    }

    /**
     * S3/MinIO 임시 업로드(PUT) URL 발급
     * 만료시간 기본 5분 (300초)
     */
    async getPresignedPutUrl(objectName: string, expiry: number = 5 * 60): Promise<string> {
        try {
            // yuna 버킷에 업로드
            return await this.minioClient.presignedPutObject('yuna', objectName, expiry);
        } catch (err) {
            this.logger.error(`Presigned PUT URL 발급 실패: ${objectName}`, err);
            throw new Error('파일 업로드 URL 발급에 실패했습니다.');
        }
    }

    /**
     * S3/MinIO 임시 다운로드(GET) URL 발급
     * 만료시간 기본 5분 (300초)
     */
    async getPresignedGetUrl(objectName: string, expiry: number = 5 * 60): Promise<string> {
        try {
            // yuna 버킷에서 다운로드
            return await this.minioClient.presignedGetObject('yuna', objectName, expiry);
        } catch (err) {
            this.logger.error(`Presigned GET URL 발급 실패: ${objectName}`, err);
            throw new Error('파일 다운로드 URL 발급에 실패했습니다.');
        }
    }
}
