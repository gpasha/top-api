/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramOptions = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');

  if (!token) {
    throw new Error('TELEGRAM_TOKEN is NOT set!');
  }

  return {
    token,
    chatId: configService.get('TELEGRAM_CHAT_ID') ?? '',
  };
};
