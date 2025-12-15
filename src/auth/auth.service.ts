import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  NOT_VALID_CREDENTIALS_ERROR,
  USER_NOT_FOUND_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });

    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(dto: AuthDto) {
    const user = await this.findUser(dto.login);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(dto.password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(NOT_VALID_CREDENTIALS_ERROR);
    }

    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
