import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTconfig } from 'src/configs/jwt.config';
import { JWTStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTconfig,
    }),
    PassportModule,
  ],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
