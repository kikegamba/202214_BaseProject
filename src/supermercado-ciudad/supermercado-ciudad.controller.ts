import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from '../dto/supermercado.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoCiudadController {
    constructor(private readonly ciudadSupermercadoService: SupermercadoCiudadService){}

    @Post(':cityId/supermarkets/:supermarketId')
    async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.addSupermarketToCity(supermarketId, cityId);
    }

    @Get(':cityId/supermarkets/:supermarketId')
    async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, supermarketId);
    }

    @Get(':cityId/supermarkets')
    async findSupermarketsFromCity(@Param('cityId') cityId: string){
        return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
    }

    @Put(':cityId/supermarkets')
    async updateSupermarketsFromCity(@Body() supermarketsDto: SupermercadoDto[], @Param('cityId') cityId: string){
        const supermarkets = plainToInstance(SupermercadoEntity, supermarketsDto)
        return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, supermarkets);
    }
    
    @Delete(':cityId/supermarkets/:supermarketId')
    @HttpCode(204)
    async deleteArtworkMuseum(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, supermarketId);
    }
}
