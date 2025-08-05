import { Module } from '@nestjs/common';
import { VehicleController } from '../controllers/vehicle.controller';
import { VehicleService } from '../services/vehicle.service';
import { DatabaseModule, RabbitMessageQueueModule } from "@app/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { VehicleEntity } from "@app/common/entities/vehicle.entity";
import { VehicleListener } from "../listeners/vehicle.listener";
import { AuthorizationModule } from "@app/common/authorization/authorization.module";

@Module({
    controllers: [VehicleController, VehicleListener],
    providers: [VehicleService],
    imports: [
        DatabaseModule,
        RabbitMessageQueueModule,
        MikroOrmModule.forFeature({ entities: [VehicleEntity] }),
        AuthorizationModule,
    ],
})
export class VehicleModule {}
