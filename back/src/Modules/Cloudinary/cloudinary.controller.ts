import {
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/carrucel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 300000,
            message: 'el archivo es muy grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const result = await this.cloudinaryService.uploadFile(file);
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw new InternalServerErrorException(
        'Hubo un error al subir la imagen',
      );
    }
  }

  @Get('/carrucel')
  async getImagescarrucel() {
    const folder = 'cc407b2851093a4726c1d776dc9b2a3f18';
    try {
      const result = await this.cloudinaryService.getImagesFromFolder(folder);
      return result;
    } catch (error) {
      console.error('Error al obtener imágenes:', error);

      throw new InternalServerErrorException(
        'Hubo un error al obtener las imágenes de la carpeta.',
      );
    }
  }
  @Get('/home')
  async getimagehome() {
    const folder = 'folder-home';
    try {
      const result = await this.cloudinaryService.getImagesFromFolder(folder);
      return result;
    } catch (error) {
      console.error('Error al obtener imágenes:', error);

      throw new InternalServerErrorException(
        'Hubo un error al obtener las imágenes de la carpeta.',
      );
    }
  }
}
