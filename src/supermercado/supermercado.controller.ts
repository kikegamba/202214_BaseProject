import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from '../dto/supermercado.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermarketService: SupermercadoService) {}

    @Get()
    async findAll() {
      return await this.supermarketService.findAll();
    }
  
    @Get(':supermarketId')
    async findOne(@Param('supermarketId') supermarketId: string) {
      return await this.supermarketService.findOne(supermarketId);
    }
  
    @Post()
    async create(@Body() supermarketDto: SupermercadoDto) {
      const supermarket: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermarketDto);
      return await this.supermarketService.create(supermarket);
    }
  
    @Put(':supermarketId')
    async update(@Param('supermarketId') supermarketId: string, @Body() supermarketDto: SupermercadoDto) {
      const supermarket: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermarketDto);
      return await this.supermarketService.update(supermarketId, supermarket);
    }
  
    @Delete(':supermarketId')
    @HttpCode(204)
    async delete(@Param('supermarketId') supermarketId: string) {
      return await this.supermarketService.delete(supermarketId);
    }
}
