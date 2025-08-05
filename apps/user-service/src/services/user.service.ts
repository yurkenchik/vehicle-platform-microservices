import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/common/entities/user.entity";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UserNotFoundException } from "../shared/exceptions/user-not-found.exception";
import { EventMessages } from "@app/common";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UpdateUserDto } from "../dto/request/update-user.dto";
import { DeleteRecordResponseDto } from "@app/common/dto/response/delete-record-response.dto";
import { v4 as uuid } from "uuid";
import { Services } from "@app/common/constants/services";
import { lastValueFrom } from "rxjs";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        @Inject(Services.UserService)
        private readonly userServiceClientProxy: ClientProxy,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const { id, email, hashedPassword } = createUserDto;

        await this.userRepository
            .createQueryBuilder()
            .insert({ id, email, password: hashedPassword })
            .execute();
        const user = await this.getUserById(id);

        await lastValueFrom(
            this.userServiceClientProxy.emit(EventMessages.User.Created, {
                data: { userId: user.id, email: user.email },
            })
        );

        return user;
    }

    async getUserById(id: string): Promise<UserEntity> {
        const user = await this.userRepository
            .createQueryBuilder()
            .where({ id })
            .getSingleResult();

        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    async getUsers(): Promise<Array<UserEntity>> {
        return this.userRepository
            .createQueryBuilder()
            .getResultList();
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.getUserById(id);
        const updatedUserQueryResult = await this.userRepository
            .createQueryBuilder()
            .where({ id: user.id })
            .update(updateUserDto)
            .execute();

        const updatedUser = await this.getUserById(updatedUserQueryResult.insertId);
        this.userServiceClientProxy.emit(EventMessages.User.Updated, {
            type: EventMessages.User.Updated,
            data: { id: user.id, email: user.email },
        });

        return updatedUser;
    }

    async deleteUser(id: string): Promise<DeleteRecordResponseDto> {
        const deletedUserQueryResult = await this.userRepository
            .createQueryBuilder()
            .delete()
            .where({ id })
            .execute();

        this.userServiceClientProxy.emit(EventMessages.User.Deleted, {
            type: EventMessages.User.Deleted,
            data: { id: deletedUserQueryResult.insertId }
        });
        return { id };
    }
}