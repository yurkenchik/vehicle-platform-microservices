import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { VehicleEntity } from "@app/common/entities/vehicle.entity";
import { CommonEntityInterface } from "@app/common/interfaces/common-entity.interface";

@Entity()
export class UserEntity implements CommonEntityInterface {
    @PrimaryKey()
    id: string;

    @Property()
    email: string;

    @OneToMany(() => VehicleEntity, vehicle => vehicle.user)
    vehicles: Collection<VehicleEntity> = new Collection<VehicleEntity>(this);
}