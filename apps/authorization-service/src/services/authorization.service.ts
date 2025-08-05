import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "./token.service";
import { Services } from "@app/common/constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { RegistrationDto } from "../dto/request/registration.dto";
import { AuthorizationResponseDto } from "../dto/response/authorization-response.dto";
import { v4 as uuid } from "uuid";
import { lastValueFrom } from "rxjs";
import { EventMessages } from "@app/common";
import { LoginDto } from "../dto/request/login.dto";
import { InjectRepository } from "@mikro-orm/nestjs";
import { UserEntity } from "@app/common/entities/user.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import * as bcrypt from "bcrypt";
import { UserAlreadyExistsException } from "../shared/exceptions/user-already-exists.exception";
import { PasswordsDontMatchException } from "../shared/exceptions/passwords-dont-match.exception";

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly tokenService: TokenService,
        @Inject(Services.AuthorizationService)
        private readonly authorizationServiceClientProxy: ClientProxy,
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
    ) {}

    async registration(registrationDto: RegistrationDto): Promise<AuthorizationResponseDto> {
        const { email, password } = registrationDto;

        const isUserExistingWithThisEmail = await this.userRepository.findOne({ email });
        if (isUserExistingWithThisEmail) {
            throw new UserAlreadyExistsException();
        }

        const id = uuid();
        const token = await this.tokenService.generateToken({ id, email });
        const hashedPassword = await bcrypt.hash(password, 5);

        await lastValueFrom(
            this.authorizationServiceClientProxy.emit(EventMessages.Authorization.Registered, {
                data: { id, email, hashedPassword },
            })
        );

        return { token };
    }

    async login(loginDto: LoginDto): Promise<AuthorizationResponseDto> {
        const { email, password } = loginDto;

        const userFromDb = await this.userRepository.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, userFromDb.password);

        if (!isPasswordValid) {
            throw new PasswordsDontMatchException();
        }

        const token = await this.tokenService.generateToken({ id: userFromDb.id, email });
        return { token };
    }
}
