import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { EventPayloadInterface } from "@app/common/interfaces/common-instances/event-payload.interface";
import { UserRegisteredEventInterface } from "@app/common/interfaces/events";
import { UserService } from "../services/user.service";
import { EventMessages, RabbitMessageQueueService } from "@app/common";

@Controller()
export class UserListener {
    private readonly logger: Logger = new Logger(UserListener.name);

    constructor(
        private readonly userService: UserService,
        private readonly rabbitMessageQueueService: RabbitMessageQueueService,
    ) {}

    @EventPattern(EventMessages.Authorization.Registered)
    async handleUserRegistered(
        @Payload() message: EventPayloadInterface<UserRegisteredEventInterface>,
        @Ctx() context: RmqContext
    ): Promise<void> {
        await this.userService.createUser(message.data);
        this.rabbitMessageQueueService.acknowledge(context);

        this.logger.verbose('Successfully created a user for event - authorization.registered');
    }
}