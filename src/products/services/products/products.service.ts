import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // importamos el decorador de typeorm
import { Repository, In } from 'typeorm'; // importamos el repositorio de typeorm

import { Product } from './../../entities/product.entity';
import { Brand } from 'src/products/entities/brand.entity';
import { CreateProductDto, UpdateProductDto } from '../../dtos/products.dtos';
import { Category } from 'src/products/entities/category.entity';

@Injectable()
export class ProductsService {
  // Inyectamos el repositorio de productos y luego le decimos la visibilidad de este repositorio para que solo sea accesible desde esta clase que seria private
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    // inyeccion de la tabla category
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    // nos trae todos los productos
    return this.productRepo.find({
      relations: ['brand'], // con esto le decimos que nos traiga la informacion de la relacion brand
    });
  }

  //es asincrona porque usa await
  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'categories'],
    }); // o tambien  findOneBy({ id })
    if (!product) {
      // aqui enviamos un error en imsonia 404 y un message para el manejo de errores
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    // const newProduct =  new Product();
    // newProduct.name = payload.name;
    // newProduct.description = payload.description;
    // newProduct.price = payload.price;
    // newProduct.stock = payload.stock;
    // newProduct.image = payload.image;
    // de esta manera le decimos a typeorm que cree un nuevo producto con create, es decir que cree un instancia de la entidad Product, pero no la guarda en base de datos hasta que hagamos save
    const newProduct = this.productRepo.create(payload);
    if (payload.brandId) {
      // ojo adicionalemnte me trae todas las relaciones de brand, eso deberia de arreglarse
      const brand = await this.brandRepo.findOne({
        where: { id: payload.brandId },
      });
      newProduct.brand = brand;
    }
    if (payload.categoriesId) {
      // inyectamos In de typeorm para que nos traiga los elementos que estan en el array
      // ejemplo this.categoryRepo.findBy({id: In([1, 2, 3, 4])}) asi tmb podria funcionar
      const categories = await this.categoryRepo.findBy({
        id: In(payload.categoriesId),
      });
      newProduct.categories = categories;
      newProduct.categories = categories;
    }
    // y aqui lo guardamos en la base de datos
    return this.productRepo.save(newProduct);
  }

  // es asincrono porque usamos Await
  async update(id: number, payload: UpdateProductDto) {
    const product = await this.productRepo.findOneBy({ id }); // o {id:id} tambien
    // Lo que hace es actualizar la informacion con base al producto que le pasamos y la informacion que le pasamos en el payload
    if (payload.brandId) {
      const brand = await this.brandRepo.findOne({
        where: { id: payload.brandId },
      });
      product.brand = brand;
    }
    this.productRepo.merge(product, payload);
    return this.productRepo.save(product);
  }

  remove(id: number) {
    return this.productRepo.delete(id);
  }
}
