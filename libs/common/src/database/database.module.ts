import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { UserEntity } from "@app/common/entities/user.entity";
import { VehicleEntity } from "@app/common/entities/vehicle.entity";
import { MikroOrmCoreModule } from "@mikro-orm/nestjs/mikro-orm-core.module";

const entities = [UserEntity, VehicleEntity];

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MikroOrmCoreModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                driver: PostgreSqlDriver,
                entities,
                entitiesTs: entities,
                dbName: configService.get<string>('DATABASE_NAME'),
                user: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                allowGlobalContext: true,
            }),
        })
    ],
})
export class DatabaseModule {}