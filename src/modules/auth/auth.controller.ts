import {
  Controller,
  Post,
  Body,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { Public } from 'src/shared/decorators/public.decorator';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.userRepository.findOneBy({
      email: signUpDto.email,
    });
    if (user)
      throw new HttpException(
        'auth.errors.validation.uniqueEmail',
        HttpStatus.BAD_REQUEST,
      );
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: LoginDto, @Body() loginDto: LoginDto) {
    return this.authService.login(req);
  }
}
