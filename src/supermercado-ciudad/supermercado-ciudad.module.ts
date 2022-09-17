import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Module({
  providers: [SupermercadoCiudadService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
})
export class SupermercadoCiudadModule {}
