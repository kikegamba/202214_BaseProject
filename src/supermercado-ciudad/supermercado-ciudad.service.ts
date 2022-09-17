import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupermercadoCiudadService {

    constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>
    ) {}

     // Asociar un supermercado a una ciudad.
    async addSupermarketToCity(supermarketId: string, cityId: string): Promise<CiudadEntity> {
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
       
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]}) 
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
     
        city.supermercados = [...city.supermercados, supermarket];
        return await this.ciudadRepository.save(city);
      }
     
     // Obtener los supermercados que tiene una ciudad.
    async findSupermarketsFromCity(cityId: string): Promise<SupermercadoEntity[]> {
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
        
        return city.supermercados;
    }

     // Obtener un supermercado de una ciudad.
    async findSupermarketFromCity(cityId: string, supermarketId: string): Promise<SupermercadoEntity> {
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND)
        
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]}); 
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
    
        const citySupermarket: SupermercadoEntity = city.supermercados.find(e => e.id === supermarket.id);
    
        if (!citySupermarket)
          throw new BusinessLogicException("The supermarket with the given id is not associated to the city", BusinessError.PRECONDITION_FAILED)
    
        return citySupermarket;
    }
     
    // Actualizar los supermercados que tiene una ciudad.
    async updateSupermarketsFromCity(cityId: string, supermarkets: SupermercadoEntity[]): Promise<CiudadEntity> {
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
     
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < supermarkets.length; i++) {
          const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarkets[i].id}});
          if (!supermarket)
            throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        city.supermercados = supermarkets;
        return await this.ciudadRepository.save(city);
      }
     
    // Eliminar el supermercado que tiene una ciudad.  
    async deleteSupermarketFromCity(cityId: string, supermarketId: string){
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND)
     
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
     
        const citySupermarket: SupermercadoEntity = city.supermercados.find(e => e.id === supermarket.id);
     
        if (!citySupermarket)
            throw new BusinessLogicException("The supermarket with the given id is not associated to the city", BusinessError.PRECONDITION_FAILED)

        city.supermercados = city.supermercados.filter(e => e.id !== supermarketId);
        await this.ciudadRepository.save(city);
    } 
}
