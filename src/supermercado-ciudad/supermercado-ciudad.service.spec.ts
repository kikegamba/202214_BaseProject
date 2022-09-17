import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoCiudadService', () => {
  let service: SupermercadoCiudadService;
  let cityRepository: Repository<CiudadEntity>;
  let supermarketRepository: Repository<SupermercadoEntity>;
  let city: CiudadEntity;
  let supermarketList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    service = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
    cityRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermarketRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermarketRepository.clear();
    cityRepository.clear();

    supermarketList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermercadoEntity = await supermarketRepository.save({
          id: "PRUEBA_NOMBRE_134"+i,
          nombre: "PRUEBA_NOMBRE_134"+i, 
          longitud:faker.lorem.word(11) , 
          latitud: faker.lorem.word(11) , 
          paginaWeb: faker.lorem.word(11),
        })
        supermarketList.push(supermarket);
    }

    city = await cityRepository.save({
      id: "PRUEBA",
      name: "NOMBRE_CIUDAD", 
      pais: "ARGENTINA", 
      numeroHabitantes: 1000000, 
      supermercados: supermarketList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an supermarket to a city', async () => {
    const newSupermarket: SupermercadoEntity = await supermarketRepository.save({
      id: "ADD_ID_SUPER_1",
      nombre: "PRUEBA_NOMBRE_1378", 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
    });

    const newCity: CiudadEntity = await cityRepository.save({
      id: "ADD_ID_CITY_1",
      name: faker.lorem.word(10), 
      pais: "ARGENTINA", 
      numeroHabitantes: 1000000
    })

    const result: CiudadEntity = await service.addSupermarketToCity(newSupermarket.id, newCity.id);
    
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermarket.nombre)
    expect(result.supermercados[0].latitud).toBe(newSupermarket.latitud)
    expect(result.supermercados[0].longitud).toBe(newSupermarket.longitud)
    expect(result.supermercados[0].paginaWeb).toBe(newSupermarket.paginaWeb)
  });

  it('addSupermarketCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CiudadEntity = await cityRepository.save({
      id: "ADD_ID_SUPER_101",
      name: faker.lorem.word(10), 
      pais: "ARGENTINA", 
      numeroHabitantes: 1000000
    })

    await expect(() => service.addSupermarketToCity( "0", newCity.id)).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('addSupermarketCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermercadoEntity = await supermarketRepository.save({
      id: "ADD_ID_SUPER_345",
      nombre: "PRUEBA_NOMBRE_17853", 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
    });

    await expect(() => service.addSupermarketToCity( newSupermarket.id, "00")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findSupermarketByCityIdSupermarketId should return supermarket by city', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0];
    const storedSupermarket: SupermercadoEntity = await service.findSupermarketFromCity(city.id, supermarket.id, )
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toBe(supermarket.nombre);
    expect(storedSupermarket.latitud).toBe(supermarket.latitud);
    expect(storedSupermarket.longitud).toBe(supermarket.longitud);
    expect(storedSupermarket.paginaWeb).toBe(supermarket.paginaWeb);
  });

  it('findSupermarketByCityIdSupermarketId should throw an exception for an invalid supermarket', async () => {
    await expect(()=> service.findSupermarketFromCity(city.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found"); 
  });

  it('findSupermarketByCityIdSupermarketId should throw an exception for an invalid city', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0]; 
    await expect(()=> service.findSupermarketFromCity("0", supermarket.id)).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('findSupermarketByCityIdSupermarketId should throw an exception for an supermarket not associated to the city', async () => {
    const newSupermarket: SupermercadoEntity = await supermarketRepository.save({
      id: "SUPER_ID_1",
      nombre: "PRUEBA_NOMBRE_15", 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
    });

    await expect(()=> service.findSupermarketFromCity(city.id, newSupermarket.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city"); 
  });

  it('findSupermarketsByCityId should return supermarkets by city', async ()=>{
    const supermarkets: SupermercadoEntity[] = await service.findSupermarketsFromCity(city.id);
    expect(supermarkets.length).toBe(5)
  });

  it('findSupermarketsByCityId should throw an exception for an invalid city', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('updateSupermarketsFromCity should update supermarkets list for a city', async () => {
    const newSupermarket: SupermercadoEntity = await supermarketRepository.save({
      id: "SUPER_ID_101",
      nombre: "PRUEBA_NOMBREFROM_19", 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
    });

    const updatedCity: CiudadEntity = await service.updateSupermarketsFromCity(city.id, [newSupermarket]);
    expect(updatedCity.supermercados.length).toBe(1);

    expect(updatedCity.supermercados[0].nombre).toBe(newSupermarket.nombre);
    expect(updatedCity.supermercados[0].latitud).toBe(newSupermarket.latitud);
    expect(updatedCity.supermercados[0].longitud).toBe(newSupermarket.longitud);
    expect(updatedCity.supermercados[0].paginaWeb).toBe(newSupermarket.paginaWeb);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermercadoEntity = await supermarketRepository.save({
      id: "SUPER_ID_34",
      nombre: "PRUEBA_NOMBREIO_1456", 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
    });

    await expect(()=> service.updateSupermarketsFromCity("908", [newSupermarket])).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const newSupermarket: SupermercadoEntity = supermarketList[0];
    newSupermarket.id = "0";

    await expect(()=> service.updateSupermarketsFromCity(city.id, [newSupermarket])).rejects.toHaveProperty("message", "The supermarket with the given id was not found"); 
  });

  it('deleteSupermarketFromCity should remove an supermarket from a city', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0];
    
    await service.deleteSupermarketFromCity(city.id, supermarket.id);

    const storedCity: CiudadEntity = await cityRepository.findOne({where: {id: city.id}, relations: ["supermercados"]});
    const deletedSupermarket: SupermercadoEntity = storedCity.supermercados.find(a => a.id === supermarket.id);

    expect(deletedSupermarket).toBeUndefined();

  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(()=> service.deleteSupermarketFromCity(city.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found"); 
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermarket: SupermercadoEntity = supermarketList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermarket.id)).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('deleteSupermarketToCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermarket: SupermercadoEntity = await supermarketRepository.save({
      id: "SUPER_ID_090",
      nombre: "PRUEBA_NOMBRE_246", 
      longitud:faker.lorem.word(11) , 
      latitud: faker.lorem.word(11) , 
      paginaWeb: faker.lorem.word(11),
    });

    await expect(()=> service.deleteSupermarketFromCity(city.id, newSupermarket.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city"); 
  }); 

});
