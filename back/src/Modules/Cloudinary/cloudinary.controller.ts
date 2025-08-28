import {
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../Users/user.service';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UsersService,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
  ) {}

  @Post('/carrucel')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
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
  @Put('perfil/:userId')
  @UseGuards(PassportJwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadimageperfil(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
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
      const result = await this.cloudinaryService.uploadfileperfil(file);

      await this.userService.updateUserProfileImage(userId, {
        url: result.secure_url,
        public_id: result.public_id,
      });

      return {
        message: 'Imagen de perfil subida correctamente',
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
  @Get('/perfil/:id')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard)
  async getimageperfil(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const folder = 'users';
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
