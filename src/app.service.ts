import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { MessageBody } from './MessageBody';
@Injectable()
export class AppService {
  private readonly expo: Expo;
  constructor(configService: ConfigService) {
    const expo = new Expo({
      accessToken: configService.get<string>('EXPO_ACCESS_TOKEN'),
    });
    this.expo = expo;
  }
  sendNotifications({ recipients, body, title, data }: MessageBody) {
    const filteredRecipients = recipients.filter((token) =>
      Expo.isExpoPushToken(token),
    );

    let dataObject: Record<string, any> | undefined = undefined;
    if (data) {
      dataObject = JSON.parse(data);
    }

    this.sendpushMessages(
      filteredRecipients.map(
        (token) =>
          ({
            to: token,
            sound: 'default',
            body: body,
            title: title,
            data: dataObject,
          }) as ExpoPushMessage,
      ),
    );

    return {
      message: 'Notification sent successfully',
    };
  }

  private async sendpushMessages(messages: ExpoPushMessage[]) {
    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);

        for (const ticket of ticketChunk) {
          if ('id' in ticket) {
            console.log(ticket.id);
          } else {
            console.log(ticket.message);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
