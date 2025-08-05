import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule, RabbitMessageQueueModule } from "@app/common";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "@app/common/entities/user.entity";
import { Services } from "@app/common/constants/services";
import { AuthorizationModule } from "@app/common/authorization/authorization.module";
import { UserListener } from "../listeners/user.listener";

@Module({
    providers: [UserService],
    controllers: [UserController, UserListener],
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        RabbitMessageQueueModule,
        RabbitMessageQueueModule.register({ name: Services.UserService }),
        MikroOrmModule.forFeature({ entities: [UserEntity] }),
        AuthorizationModule
    ],
    exports: [UserService],
})
export class UserModule {}