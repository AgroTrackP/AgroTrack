// src/cloudinary/cloudinary.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import {
  CloudinaryImageDto,
  CloudinarySearchResponse,
} from './DTO/cloudinary.dto';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cc407b2851093a4726c1d776dc9b2a3f18',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error) return reject(error);
          resolve(result);
        },
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  async getImagesFromFolder(folderName: string): Promise<CloudinaryImageDto[]> {
    try {
      const result = await (cloudinary.search
        .expression(`folder:${folderName}`)
        .sort_by('created_at', 'desc')
        .max_results(30)
        .execute() as Promise<CloudinarySearchResponse>);

      if (!result || !result.resources.length) {
        throw new NotFoundException('no se encontro el producto');
      }

      return result.resources.map((file) => ({
        url: file.secure_url,
        public_id: file.public_id,
        created_at: file.created_at,
      }));
    } catch (error) {
      console.error('Error al obtener imágenes de Cloudinary:', error);
      throw error;
    }
  }
  async uploadfileperfil(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'users',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error) return reject(error);
          resolve(result);
        },
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }
}
