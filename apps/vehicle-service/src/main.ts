import { NestFactory } from '@nestjs/core';
import { VehicleModule } from './modules/vehicle.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MikroORM } from "@mikro-orm/core";
import { RabbitMessageQueueService } from "@app/common";
import { RmqOptions } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(VehicleModule);

    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    const logger = new Logger('Vehicle-Microservice');
    const PORT = configService.get<number>('VEHICLES_SERVICE_PORT');

    const mikroOrm = app.get(MikroORM);
    await mikroOrm.getSchemaGenerator().updateSchema();

    const rabbitMessageQueueService = app.get(RabbitMessageQueueService);
    app.connectMicroservice<RmqOptions>(rabbitMessageQueueService.getOptions('VEHICLES'));
    app.connectMicroservice<RmqOptions>(rabbitMessageQueueService.getOptions('USERS'));
    await app.startAllMicroservices();

    await app.listen(PORT, () => logger.log(`Vehicle microservice is running pn PORT: ${PORT}`));
}
bootstrap();
