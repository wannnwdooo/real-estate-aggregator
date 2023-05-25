import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApartmentDto } from './dto/apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';
import { FilterOptions } from './types/filter-options.type';
import { FilterOptionsConstants } from './constants/filter-options.constants';
import { processFilter } from '../../utils/database/number-filter.database';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentsRepository: Repository<Apartment>,
  ) {}
  async create(apartmentDto: ApartmentDto) {
    const { number } = apartmentDto;

    const duplicateApartment = await this.apartmentsRepository.findOne({
      where: { number },
    });
    if (duplicateApartment) {
      throw new HttpException(
        'Квартира с такими данными уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const apartment = this.apartmentsRepository.create(apartmentDto);
    console.log({ apartment });
    return await this.apartmentsRepository.save(apartment);
  }

  async search(
    filter: FilterOptions,
    page: number,
    limit: number,
    order = 'id',
    orderType: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{
    result: Apartment[];
    options;
    minMaxOptions: Record<string, { min: number; max: number }>;
    totalCount: number;
    currentPage: number;
    pages: number;
    order: string;
    orderType: string;
  }> {
    const queryBuilder =
      this.apartmentsRepository.createQueryBuilder('apartment');

    const fields = ['floor', 'area', 'price'];
    const promises = [];
    const minMaxOptions = {};

    fields.forEach((field) => {
      promises.push(
        queryBuilder
          .clone()
          .select(`MIN(${field})`, `${field}_min`)
          .getRawOne(),
        queryBuilder
          .clone()
          .select(`MAX(${field})`, `${field}_max`)
          .getRawOne(),
      );
    });

    const results = await Promise.all(promises);

    fields.forEach((field, index) => {
      minMaxOptions[field] = {
        min: results[index * 2][`${field}_min`],
        max: results[index * 2 + 1][`${field}_max`],
      };
    });

    const options = {};

    Object.entries(filter).forEach(([key, value]) => {
      if (typeof value === 'string' && value !== '') {
        processFilter(
          key,
          value,
          options,
          FilterOptionsConstants,
          queryBuilder,
        );
      } else if (typeof value === 'number') {
        processFilter(
          key,
          value.toString(),
          options,
          FilterOptionsConstants,
          queryBuilder,
        );
      }
    });

    const [result, totalCount] = await queryBuilder
      .orderBy(`apartment.${order}`, orderType)
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      result,
      minMaxOptions,
      options,
      order,
      orderType,
      totalCount,
      currentPage: page,
      pages: Math.ceil(totalCount / limit),
    };
  }

  async findOne(id: string): Promise<Apartment> {
    const apartment = await this.apartmentsRepository.findOne({
      where: { id },
    });
    if (!apartment) {
      throw new HttpException('Квартира не найдена', HttpStatus.NOT_FOUND);
    }
    return apartment;
  }

  async update(id: string, apartmentDto: ApartmentDto): Promise<Apartment> {
    const apartment = await this.apartmentsRepository.findOne({
      where: { id },
    });
    if (!apartment) {
      throw new HttpException('Квартира не найдена', HttpStatus.NOT_FOUND);
    }
    const updatedApartment = Object.assign(apartment, apartmentDto);
    return await this.apartmentsRepository.save(updatedApartment);
  }

  async remove(id: string): Promise<void> {
    const apartment = await this.apartmentsRepository.findOne({
      where: { id },
    });
    if (!apartment) {
      throw new HttpException('Квартира не найдена', HttpStatus.NOT_FOUND);
    }
    await this.apartmentsRepository.remove(apartment);
  }
}
