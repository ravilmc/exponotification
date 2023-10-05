import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { MessageBody } from './MessageBody';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/notify')
  sendNotification(@Body() body: MessageBody, @Req() req: Request) {
    const apiKey = req.headers['auth-api-key'];
    if (apiKey !== this.configService.get<string>('AUTH_API_KEY')) {
      throw new UnauthorizedException();
    }

    this.appService.sendNotifications(body);

    return {
      message: 'Notifications queued successfully',
    };
  }
}
