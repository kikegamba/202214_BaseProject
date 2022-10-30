import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let citiesList: CiudadEntity[];
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();
 
    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
 
  const seedDatabase = async () => {
    repository.clear();
    citiesList = [];
    for(let i = 0; i < 5; i++){
        const city: CiudadEntity = await repository.save({
          id: faker.lorem.word(10),
        name: "PRUEBA_NOMBRE"+i, 
        pais: "ARGENTINA", 
        numeroHabitantes: 1000000, 
        supermercados: null})
        citiesList.push(city);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CiudadEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CiudadEntity = citiesList[0];
    const city: CiudadEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name)
    expect(city.id).toEqual(storedCity.id)
    expect(city.pais).toEqual(storedCity.pais)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found")
  });

  it('create should return a new city', async () => {
    const city: CiudadEntity = {
      id: "",
      name: faker.lorem.word(10), 
      pais: "ARGENTINA", 
      numeroHabitantes: 1000000, 
      supermercados: []
    }

    const newCity: CiudadEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity: CiudadEntity = await repository.findOne({where: {id: city.id}})
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name)
    expect(storedCity.pais).toEqual(newCity.pais)
    expect(storedCity.numeroHabitantes).toEqual(newCity.numeroHabitantes)
  });

  it('create should return a exception because country doesnt belog to list', async () => {
    const city: CiudadEntity = {
      id: "",
      name: faker.lorem.word(10), 
      pais: "ARGENTINAS", 
      numeroHabitantes: 1000000, 
      supermercados: []
    }

    await expect(() => service.create(city)).rejects.toHaveProperty("message", "The country doesnt belong to the country list")


  });

  it('update should modify a city', async () => {
    const city: CiudadEntity = citiesList[0];
    city.name = "New name";
    city.numeroHabitantes = 100;
  
    const updatedCity: CiudadEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
  
    const storedCity: CiudadEntity = await repository.findOne({ where: { id: city.id } })
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name)
    expect(storedCity.numeroHabitantes).toEqual(city.numeroHabitantes)
  });
 
  it('update should throw an exception for an invalid city', async () => {
    let city: CiudadEntity = citiesList[0];
    city = {
      ...city, name: "New name", numeroHabitantes: 500
    }
    await expect(() => service.update("400", city)).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

  it('delete should remove a city', async () => {
    const city: CiudadEntity = citiesList[0];
    await service.delete(city.id);
  
    const deletedCity: CiudadEntity = await repository.findOne({ where: { id: city.id } })
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const city: CiudadEntity = citiesList[0];
    await service.delete(city.id);
    await expect(() => service.delete("345")).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

 });
