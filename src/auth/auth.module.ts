import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalStrategy} from './strategies/local.strategy';
import {JwtStrategy} from './strategies/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from './constants/constants';
import {AuthResolver} from "./auth.resolver";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./auth.schema";
import {User} from "./auth.dto";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
