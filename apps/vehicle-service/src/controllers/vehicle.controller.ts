import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { VehicleService } from '../services/vehicle.service';
import { VehicleEntity } from "@app/common/entities/vehicle.entity";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";
import { DeleteRecordResponseDto } from "@app/common/dto/response/delete-record-response.dto";
import { AuthorizationGuard } from "@app/common/authorization/authorization.guard";

@UseGuards(AuthorizationGuard)
@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleServiceService: VehicleService) {}

    @Get(':id')
    async getVehicleById(@Param('id') id: string): Promise<VehicleEntity> {
        return this.vehicleServiceService.getVehicleById(id);
    }

    @Get()
    async getVehicles(): Promise<Array<VehicleEntity>> {
        return this.vehicleServiceService.getVehicles();
    }

    @Post()
    async createVehicle(@Body() createVehicleDto: CreateVehicleDto): Promise<VehicleEntity> {
        return this.vehicleServiceService.createVehicle(createVehicleDto);
    }

    @Patch(':id')
    async updateVehicle(
        @Param('id') id: string,
        @Body() updateVehicleDto: UpdateVehicleDto,
    ): Promise<VehicleEntity> {
        return this.vehicleServiceService.updateVehicle(id, updateVehicleDto);
    }

    @Delete(':id')
    async deleteVehicle(@Param('id') id: string): Promise<DeleteRecordResponseDto> {
        return this.vehicleServiceService.deleteVehicle(id);
    }
}
