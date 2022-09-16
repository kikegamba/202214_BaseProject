import { CiudadEntity } from "src/ciudad/ciudad.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    pais: string;

    @Column()
    numeroHabitantes: number;

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    @JoinTable()
    ciudades: CiudadEntity[];
}
