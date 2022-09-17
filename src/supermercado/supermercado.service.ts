import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {

     countries:["Argentina","Ecuador","Paraguay"] 

    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ){}



    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({ relations: ["ciudades"] });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: ["ciudades"] } );
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
        return supermarket;
    }
    
    async create(supermarket: SupermercadoEntity): Promise<SupermercadoEntity> {
        if (supermarket.nombre.length<10)
          throw new BusinessLogicException("The length of the supermarket name has to be larger than 10 characters", BusinessError.NOT_FOUND);
        return await this.supermercadoRepository.save(supermarket);
    }

    async update(id: string, supermarket: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedsupermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!persistedsupermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
        if (supermarket.nombre.length>10)
          throw new BusinessLogicException("The length of the supermarket name has to be larger than 10 characters", BusinessError.NOT_FOUND);
      
        return await this.supermercadoRepository.save({...persistedsupermarket, ...supermarket});
    }

    async delete(id: string) {
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.supermercadoRepository.remove(supermarket);
    }
}
