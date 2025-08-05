import { NestFactory } from '@nestjs/core';
import { AuthorizationModule } from './modules/authorization.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AuthorizationModule);

    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    const logger = new Logger('Authorization-Microservice');
    const PORT = configService.get<number>('AUTHORIZATION_SERVICE_PORT');

    await app.listen(PORT, () => logger.log(`Authorization microservice is running on port: ${PORT}`));
}
bootstrap();
