import { Body, Controller, Delete, Get, Logger, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UserEntity } from "@app/common/entities/user.entity";
import { UpdateUserDto } from "../dto/request/update-user.dto";
import { DeleteRecordResponseDto } from "@app/common/dto/response/delete-record-response.dto";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { EventMessages } from "@app/common";
import { UserCreatedEventInterface } from "@app/common/interfaces/events";

@Controller('users')
export class UserController {
    private readonly logger: Logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.createUser(createUserDto);
    }

    @Patch(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Get()
    async getUsers(): Promise<Array<UserEntity>> {
        return this.userService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.getUserById(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<DeleteRecordResponseDto> {
        return this.userService.deleteUser(id);
    }

    @EventPattern(EventMessages.User.Created)
    async handleUserCreated(
        @Payload() message: UserCreatedEventInterface,
        @Ctx() context: RmqContext,
    ): Promise<void> {
        this.logger.debug('Handing user created event');
        const { userId } = message;
    }
}