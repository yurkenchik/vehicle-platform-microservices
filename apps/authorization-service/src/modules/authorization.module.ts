import { Module } from '@nestjs/common';
import { AuthorizationController } from '../controllers/authorization.controller';
import { AuthorizationService } from '../services/authorization.service';
import { DatabaseModule, RabbitMessageQueueModule } from "@app/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "@app/common/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TokenService } from "../services/token.service";
import { Services } from "@app/common/constants/services";

@Module({
    controllers: [AuthorizationController],
    providers: [AuthorizationService, TokenService],
    imports: [
        MikroOrmModule.forFeature({ entities: [UserEntity] }),
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        RabbitMessageQueueModule.register({ name: Services.AuthorizationService })
    ],
})
export class AuthorizationModule {}
