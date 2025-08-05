import { NestFactory } from "@nestjs/core";
import { UserModule } from "./modules/user.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RabbitMessageQueueService } from "@app/common";
import { RmqOptions } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(UserModule);

    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    const logger = new Logger('User-Microservice');
    const PORT = configService.get<number>('USERS_SERVICE_PORT');

    const rabbitMessageQueueService = app.get(RabbitMessageQueueService);
    app.connectMicroservice<RmqOptions>(rabbitMessageQueueService.getOptions('AUTHORIZATION'));
    await app.startAllMicroservices();

    await app.listen(PORT, () => logger.log(`User microservice is running on port: ${PORT}`));
}
bootstrap();