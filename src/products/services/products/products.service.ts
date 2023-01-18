import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // importamos el decorador de typeorm
import { Repository } from 'typeorm'; // importamos el repositorio de typeorm

import { Product } from './../../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../../dtos/products.dtos';

@Injectable()
export class ProductsService {
  // Inyectamos el repositorio de productos y luego le decimos la visibilidad de este repositorio para que solo sea accesible desde esta clase que seria private
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  findAll() {
    // nos trae todos los productos
    return this.productRepo.find();
  }

  findOne(id: number) {
    const product = this.productRepo.findOneBy({id:id}); // o tambien  findOneBy({ id })
    if (!product) {
      // aqui enviamos un error en imsonia 404 y un message para el manejo de errores
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  // create(payload: CreateProductDto) {
  //   console.log(payload);

  //   const newProduct = {
  //     id: this.products.length + 1,
  //     ...payload,
  //   };
  //   this.products.push(newProduct);
  //   return newProduct;
  // }

  // update(id: number, payload: UpdateProductDto) {
  //   const product = this.findOne(id);
  //   if (product) {
  //     const index = this.products.findIndex((item) => item.id === id);
  //     // aqui estamos haciendo un merge de los objetos para que no se pierdan los datos que no se estan enviando en el payload y solo se actualicen los que si se estan enviando en el payload
  //     this.products[index] = {
  //       ...product,
  //       ...payload,
  //     };
  //     return this.products[index];
  //   }
  //   return null;
  // }

  // remove(id: number) {
  //   const index = this.products.findIndex((item) => item.id === id);
  //   if (index === -1) {
  //     throw new NotFoundException(`Product #${id} not found`);
  //   }
  //   this.products.splice(index, 1);
  //   return true;
  // }
}
