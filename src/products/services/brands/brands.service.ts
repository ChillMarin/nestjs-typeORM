import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../../../products/entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../../../products/dtos/brand.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandsRepo: Repository<Brand>) {}

  findAll() {
    return this.brandsRepo.find();
  }

  findOne(id: number) {
    const product = this.brandsRepo.findOne({
      where: { id },
      // ojo cuando lo llamo desde el create product, si no le pongo esto me trae toda la informacion de la relacion brand
      relations: ['products'],
    });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  create(data: CreateBrandDto) {
    const newBrand = this.brandsRepo.create(data);
    return this.brandsRepo.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    this.brandsRepo.merge(brand, changes);
    return this.brandsRepo.save(brand);
  }

  remove(id: number) {
    return this.brandsRepo.delete(id);
  }

}
