import { Module } from "@nestjs/common";
import { RabbitMessageQueueModule } from "@app/common";
import { Services } from "@app/common/constants/services";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [RabbitMessageQueueModule.register({ name: Services.AuthorizationService }), JwtModule],
    exports: [RabbitMessageQueueModule, JwtModule],
})
export class AuthorizationModule {}