import { DynamicModule, Module } from "@nestjs/common";
import { RabbitMessageQueueService } from "@app/common/rabbit-message-queue/rabbit-message-queue.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

interface RabbitMessageQueueModuleOptionsInterface {
    name: string;
}

@Module({
    providers: [RabbitMessageQueueService],
    exports: [RabbitMessageQueueService],
    imports: [ConfigModule]
})
export class RabbitMessageQueueModule {
    static register(rabbitMessageQueueModuleOptions: RabbitMessageQueueModuleOptionsInterface): DynamicModule {
        return {
            module: RabbitMessageQueueModule,
            imports: [
                ClientsModule.registerAsync([{
                    name: rabbitMessageQueueModuleOptions.name,
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        console.log(`RABBIT MQ URL: ${configService.get<string>('RABBIT_MQ_URL')}`);
                        console.log(`RABBIT MQ USERS QUEUE: ${configService.get<string>(`RABBIT_MQ_${rabbitMessageQueueModuleOptions.name}_QUEUE`)}`);

                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBIT_MQ_URL')],
                                queue: configService.get<string>(`RABBIT_MQ_${rabbitMessageQueueModuleOptions.name}_QUEUE`),
                            },
                        };
                    },
                }]),
                ConfigModule
            ],
            exports: [ClientsModule],
        }
    }
}