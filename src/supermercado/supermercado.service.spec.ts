import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermarketList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermercadoEntity = await repository.save({
        id: faker.lorem.word(10),
        nombre: "PRUEBA_NOMBRE_134"+i, 
        longitud:faker.lorem.word(11) , 
        latitud: faker.lorem.word(11) , 
        paginaWeb: faker.lorem.word(11),
        ciudades: null})
        supermarketList.push(supermarket);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermercadoEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
  });

  it('findOne should return a supermarket by id', async () => {
    const storedsupermarket: SupermercadoEntity = supermarketList[0];
    const supermarket: SupermercadoEntity = await service.findOne(storedsupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.nombre).toEqual(storedsupermarket.nombre)
    expect(supermarket.id).toEqual(storedsupermarket.id)
    expect(supermarket.latitud).toEqual(storedsupermarket.latitud)
    expect(supermarket.longitud).toEqual(storedsupermarket.longitud)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("140")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermercadoEntity = {
      id: "",
      nombre: "PRUEBA_CREACION_SPEC",
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
      ciudades: null
    }

    const newsupermarket: SupermercadoEntity = await service.create(supermarket);
    expect(newsupermarket).not.toBeNull();

    const storedsupermarket: SupermercadoEntity = await repository.findOne({where: {id: supermarket.id}})
    expect(storedsupermarket).not.toBeNull();
    expect(supermarket).not.toBeNull();
    expect(supermarket.nombre).toEqual(storedsupermarket.nombre)
    expect(supermarket.id).toEqual(storedsupermarket.id)
    expect(supermarket.latitud).toEqual(storedsupermarket.latitud)
    expect(supermarket.longitud).toEqual(storedsupermarket.longitud)
  });

  it('create should return a exception because length is shorter than 10 ', async () => {
    const supermarket: SupermercadoEntity = {
      id: "",
      nombre: faker.lorem.word(2), 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
      ciudades: null
    }

    await expect(() => service.create(supermarket)).rejects.toHaveProperty("message", "The length of the supermarket name has to be larger than 10 characters")

  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0];
    supermarket.nombre = "New name";
    supermarket.latitud = "LATITUDOSO";
  
    const updatedsupermarket: SupermercadoEntity = await service.update(supermarket.id, supermarket);
    expect(updatedsupermarket).not.toBeNull();
  
    const storedsupermarket: SupermercadoEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(storedsupermarket).not.toBeNull();
    expect(storedsupermarket.nombre).toEqual(supermarket.nombre)
    expect(storedsupermarket.latitud).toEqual(supermarket.latitud)
  });
 
  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermercadoEntity = supermarketList[0];
    supermarket = {
      ...supermarket, nombre: "New name", latitud: "LATITUD"
    }
    await expect(() => service.update("400", supermarket)).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0];
    await service.delete(supermarket.id);
  
    const deletedsupermarket: SupermercadoEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(deletedsupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0];
    await service.delete(supermarket.id);
    await expect(() => service.delete("345")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });
});
