import { Injectable, Abstract } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException, validateCountry,CountryList } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {

    a : 0;
    flag : true;
    countries:["Argentina","Ecuador","Paraguay"] 
    a2 : 0;
    flag2 : true;
    countries2:["Argentina","Ecuador","Paraguay"] 

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ["supermercados"] });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"] } );
        if (!ciudad)
          throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);
    
        return ciudad;
    }
    
    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        if (!validateCountry(ciudad.pais))
            throw new BusinessLogicException("The country doesnt belong to the country list", BusinessError.NOT_FOUND);
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!persistedciudad)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
        if (!validateCountry(ciudad.pais))
          throw new BusinessLogicException("The country doesnt belong to the country list", BusinessError.NOT_FOUND);

        return await this.ciudadRepository.save({...persistedciudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.ciudadRepository.remove(ciudad);
    }

    async updateCity(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
      const persistedciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
      if (!persistedciudad)
        throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
      if (!validateCountry(ciudad.pais))
        throw new BusinessLogicException("The country doesnt belong to the country list", BusinessError.NOT_FOUND);

      return await this.ciudadRepository.save({...persistedciudad, ...ciudad});
  }

  async updateCity2(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
    if (!persistedciudad)
      throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
    if (!validateCountry(ciudad.pais))
      throw new BusinessLogicException("The country doesnt belong to the country list", BusinessError.NOT_FOUND);

    return await this.ciudadRepository.save({...persistedciudad, ...ciudad});
}

async updateCity3(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
  const persistedciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
  if (!persistedciudad)
    throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
  if (!validateCountry(ciudad.pais))
    throw new BusinessLogicException("The country doesnt belong to the country list", BusinessError.NOT_FOUND);

  return await this.ciudadRepository.save({...persistedciudad, ...ciudad});
}

async updateCity4(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
const persistedciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
if (!persistedciudad)
  throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
if (!validateCountry(ciudad.pais))
  throw new BusinessLogicException("The country doesnt belong to the country list", BusinessError.NOT_FOUND);

return await this.ciudadRepository.save({...persistedciudad, ...ciudad});
}
}
