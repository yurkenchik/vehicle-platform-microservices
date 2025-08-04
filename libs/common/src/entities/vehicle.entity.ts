import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserEntity } from "@app/common/entities/user.entity";
import { CommonEntityInterface } from "@app/common/interfaces/common-entity.interface";

@Entity({ tableName: "vehicle" })
export class VehicleEntity implements CommonEntityInterface {
    @PrimaryKey()
    id: string;

    @Property()
    make: string;

    @Property()
    model: string;

    @Property({ nullable: true })
    year: number;

    @ManyToOne(() => UserEntity, { nullable: false })
    user: UserEntity;
}