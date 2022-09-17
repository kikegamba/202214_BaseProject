import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SupermercadoCiudadService', () => {
  let service: SupermercadoCiudadService;
  let cityRepository: Repository<CiudadEntity>;
  let supermarketkRepository: Repository<SupermercadoEntity>;
  let city: CiudadEntity;
  let supermarket : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    service = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
    cityRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermarketkRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
