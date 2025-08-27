import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { Users } from '../Users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { hashPassword } from 'src/Helpers/hashPassword';
import { ExcludePasswordInterceptor } from 'src/interceptor/exclude-pass.interceptor';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthRequest } from 'src/types/express';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
  ) {}

  // Ruta de registro de usuario
  @Post('register')
  async register(
    @Body() userData: CreateUserDto,
  ): Promise<{ message: string; user: Omit<Users, 'password'> }> {
    return await this.authService.register(userData);
  }

  //Ruta de inicio de sesión
  @Post('login')
  @UseInterceptors(ExcludePasswordInterceptor)
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;
    return await this.authService.login({ email, password });
  }

  // Ruta protegida con el token JWT
  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedRoute(@Req() req: Request) {
    // req.user contendrá el user
    const user = req.user as Users;
    if (!user) {
      throw new Error('User not found in request');
    }
    return `Hola ${user.name}, esta es una ruta protegida.`;
  }

  @Get('confirmation/:email')
  async confirmationEmail(@Param('email') email: string, @Res() res: Response) {
    console.log(email);
    await this.authService.confirmationEmail({ email });

    // Devolver una plantilla HTML estética y redirigir
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cuenta Verificada</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f4f8;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 90%;
            animation: fadeIn 1.5s ease-in-out;
          }
          h1 {
            color: #28a745;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.1em;
            color: #555;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        </style>
        <script>
          // Redirige al usuario después de 3 segundos
          setTimeout(() => {
            window.location.href = 'https://agrotrack-develop-full-b7e80rp5d-agrotrackprojects-projects.vercel.app/login';
          }, 3000);
        </script>
      </head>
      <body>
        <div class="container">
          <h1>¡Tu cuenta ha sido verificada! 🎉</h1>
          <a href="https://agrotrack-develop-full-b7e80rp5d-agrotrackprojects-projects.vercel.app/login">Iniciar sesión</a>
        </div>
      </body>
      </html>
    `;

    // Envía la respuesta HTML
    res.send(htmlTemplate);
  }

  // Esta ruta inicia el flujo de autenticación, redirigiendo a Auth0.
  // La guardia 'auth0' maneja la redirección.
  @Post('auth0/login')
  @UseGuards(AuthGuard('auth0-jwt'))
  async handleAuth0Login(
    @Req() req,
    // Aquí recibimos los datos que enviaste desde el frontend
    @Body()
    body: {
      name: string;
      email: string;
      picture: string;
    },
  ) {
    // El ID de Auth0 siempre viene en el payload del token como 'sub'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const auth0Id = req.user.sub;

    // Aquí usamos los datos del 'body' para el nombre y el correo
    const email = body.email;
    const name = body.name;

    let user = await this.usersDbRepo.findOne({
      where: { auth0Id },
    });

    if (!user) {
      // Genera una contraseña aleatoria de relleno
      const secureRandomPassword = await hashPassword('password-never-used');

      user = this.usersDbRepo.create({
        auth0Id: auth0Id,
        email: email, // Usamos el email del body
        name: name, // Usamos el nombre del body
        password: secureRandomPassword,
        imgUrl: body.picture,
        isConfirmed: true,
      });
      user = await this.usersDbRepo.save(user);
    }

    const yourApiToken = this.authService.generateAppToken(user);

    return { user, token: yourApiToken };
  }

  @Patch('change-password')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Change the current user password' })
  @ApiBearerAuth('jwt')
  async changePassword(
    @Req() req: AuthRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.id;
    return await this.authService.changePassword(userId, changePasswordDto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send password reset email if user exists' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.sendPasswordResetEmail(
      forgotPasswordDto.email,
    );
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset user password with a valid token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}
