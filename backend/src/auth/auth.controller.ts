import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      console.log('Registration request received:', createUserDto);
      const existingUser = await this.authService.findUserByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      const user = await this.authService.register(createUserDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new BadRequestException(error.message || 'Failed to register user');
    }
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      console.log('Login request received:', loginDto);
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      console.error('Login error:', error.message);
      throw new BadRequestException(error.message || 'Invalid credentials');
    }
  }
}