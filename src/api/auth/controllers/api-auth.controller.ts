import { Body, Controller, Post } from '@nestjs/common';
import { ApiAuthService } from '../services/api-auth.service';
import { InitData } from '@tma.js/sdk';

@Controller('')
export class ApiAuthController {
  constructor(private readonly service: ApiAuthService) {}
  @Post('connect')
  handleApiAuthConnect(@Body() params: any) {
    return this.service.sign(params);
  }
}
