import { SupermercadoEntity } from "../supermercado/supermercado.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    pais: string;

    @Column()
    numeroHabitantes: number;

    @ManyToMany(() => SupermercadoEntity, supermercado => supermercado.ciudades)
    supermercados: SupermercadoEntity[];
}
