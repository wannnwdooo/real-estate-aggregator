import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentDto } from './dto/apartment.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { FilterOptions } from './types/filter-options.type';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Поиск квартир' })
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'orderType', enum: ['ASC', 'DESC'], required: false })
  async search(
    @Query() filter: FilterOptions,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order = 'id',
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'ASC',
  ) {
    return await this.apartmentsService.search(
      filter,
      page,
      limit,
      order,
      orderType,
    );
  }

  @ApiOperation({ summary: 'Создание квартиры' })
  @ApiBody({ type: ApartmentDto })
  @ApiResponse({
    status: 201,
    description: 'Квартира успешно создана',
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    apartmentDto: ApartmentDto,
  ) {
    return this.apartmentsService.create(apartmentDto);
  }

  @ApiOperation({ summary: 'Найти квартиру по ID' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновить квартиру' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: ApartmentDto })
  @ApiResponse({ status: 200, description: 'Квартира успешно обновлена' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    apartmentDto: ApartmentDto,
  ) {
    return this.apartmentsService.update(id, apartmentDto);
  }

  @ApiOperation({ summary: 'Удалить квартиру' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Квартира успешно удалена' })
  @Delete(':id')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.apartmentsService.remove(id);
  }
}
