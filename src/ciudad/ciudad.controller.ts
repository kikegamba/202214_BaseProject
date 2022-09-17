import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CiudadService } from './ciudad.service';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CiudadDto } from 'src/dto/ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { plainToInstance } from 'class-transformer';


@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly cityService: CiudadService) {}

    @Get()
    async findAll() {
      return await this.cityService.findAll();
    }
  
    @Get(':cityId')
    async findOne(@Param('cityId') cityId: string) {
      return await this.cityService.findOne(cityId);
    }
  
    @Post()
    async create(@Body() cityDto: CiudadDto) {
      const city: CiudadEntity = plainToInstance(CiudadEntity, cityDto);
      return await this.cityService.create(city);
    }
  
    @Put(':cityId')
    async update(@Param('cityId') cityId: string, @Body() cityDto: CiudadDto) {
      const city: CiudadEntity = plainToInstance(CiudadEntity, cityDto);
      return await this.cityService.update(cityId, city);
    }
  
    @Delete(':cityId')
    @HttpCode(204)
    async delete(@Param('cityId') cityId: string) {
      return await this.cityService.delete(cityId);
    }
}
