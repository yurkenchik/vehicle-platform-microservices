import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@mikro-orm/nestjs";
import { VehicleEntity } from "@app/common/entities/vehicle.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { VehicleNotFoundException } from "../shared/exceptions/vehicle-not-found.exception";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";
import { DeleteRecordResponseDto } from "@app/common/dto/response/delete-record-response.dto";
import { v4 as uuid } from "uuid";

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepository: EntityRepository<VehicleEntity>
    ) {}

    async createPlaceholderVehicle(userId: string): Promise<VehicleEntity> {
        const id = uuid();

        await this.vehicleRepository
            .createQueryBuilder()
            .insert({
                id,
                make: "Unknown",
                model: "Unknown",
                year: null,
                user: userId
            })
            .execute();

        const vehicle = await this.getVehicleById(id);
        return vehicle;
    }

    async getVehicleById(id: string): Promise<VehicleEntity> {
        const vehicle = await this.vehicleRepository
            .createQueryBuilder()
            .where({ id })
            .getSingleResult();

        if (!vehicle) {
            throw new VehicleNotFoundException();
        }
        return vehicle;
    }

    async getVehicles(): Promise<Array<VehicleEntity>> {
        return this.vehicleRepository
            .createQueryBuilder()
            .getResultList();
    }

    async createVehicle(createVehicleDto: CreateVehicleDto): Promise<VehicleEntity> {
        const id = uuid();

        await this.vehicleRepository
            .createQueryBuilder()
            .insert({ id, ...createVehicleDto })
            .execute();

        const vehicle = await this.getVehicleById(id);
        return vehicle;
    }

    async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto): Promise<VehicleEntity> {
        await this.vehicleRepository
            .createQueryBuilder()
            .where({ id })
            .update(updateVehicleDto)
            .execute();

        const updatedVehicle = await this.getVehicleById(id);
        return updatedVehicle;
    }

    async deleteVehicle(id: string): Promise<DeleteRecordResponseDto> {
        const deleteQueryResult = await this.vehicleRepository
            .createQueryBuilder()
            .where({ id })
            .delete();

        return { id: deleteQueryResult.insertId };
    }
}
