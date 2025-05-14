import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/shared/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Public()
  @Post('register')
  register(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.register(loginAuthDto);
  }

  @Post('logout')
  logout(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.logout(loginAuthDto);
  }
}
