import { Controller, Logger } from "@nestjs/common";
import { VehicleService } from "../services/vehicle.service";
import { EventMessages, RabbitMessageQueueService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { UserCreatedEventInterface } from "@app/common/interfaces/events";
import { EventPayloadInterface } from "@app/common/interfaces/common-instances/event-payload.interface";

@Controller()
export class VehicleListener {
    private readonly logger: Logger = new Logger(VehicleListener.name);

    constructor(
        private readonly vehicleService: VehicleService,
        private readonly rabbitMessageQueueService: RabbitMessageQueueService,
    ) {}

    @EventPattern(EventMessages.User.Created)
    async handleUserCreated(
        @Payload() message: EventPayloadInterface<UserCreatedEventInterface>,
        @Ctx() context: RmqContext,
    ): Promise<void> {
        const { userId } = message.data;

        await this.vehicleService.createPlaceholderVehicle(userId);
        this.rabbitMessageQueueService.acknowledge(context);
        this.logger.verbose('Successfully created a placeholder vehicle for event - user.created');
    }
}