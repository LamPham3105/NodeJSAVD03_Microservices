import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_user_byID')
  async getUserById(@Payload() id: number) {
    return this.appService.getUserById(+id);
  }

  @MessagePattern('signup')
  async signUp(@Payload() userData: any) {
    return await this.appService.createUser(userData);
  }

  @MessagePattern('login')
  async login(@Payload() userData: any) {
    return this.appService.login(userData);
  }
}
