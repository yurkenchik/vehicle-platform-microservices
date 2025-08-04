import { Module } from '@nestjs/common';
import { VehicleController } from '../controllers/vehicle.controller';
import { VehicleService } from '../services/vehicle.service';
import { DatabaseModule, RabbitMessageQueueModule } from "@app/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { VehicleEntity } from "@app/common/entities/vehicle.entity";
import { VehicleListener } from "../listeners/vehicle.listener";

@Module({
    controllers: [VehicleController, VehicleListener],
    providers: [VehicleService],
    imports: [
        DatabaseModule,
        RabbitMessageQueueModule,
        MikroOrmModule.forFeature({ entities: [VehicleEntity] }),
    ],
})
export class VehicleModule {}
