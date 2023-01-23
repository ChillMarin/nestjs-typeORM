import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

import { User } from '../../entities/user.entity';
import { Order } from '../../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';

import { ProductsService } from '../../../products/services/products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @Inject('PG') private clientPG: Client,
    @InjectRepository(User) private userRepo: Repository<User>,
    // importamos el customer service para poder relacionarlo con el usuario
    private customerService: CustomersService,
  ) {}

  findAll() {
    // asi em trago las variables de entorno
    const apiKey = this.configService.get('API_KEY');
    const dbName = this.configService.get('DATABASE_NAME');
    //console.log(apiKey, dbName);
    return this.userRepo.find({
      // adicionalmente devuelme la relacion de customer
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    if (data.customerId) {
      const customer = await this.customerService.findOne(data.customerId);
      // le agregamos el customerid al usuario que estamos creando y lo guardamos
      newUser.customer = customer;
    }
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  // retorna un orden al colocarle el :Order
  async getOrderByUser(id: number) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }
  getJojo() {
    return new Promise((resolve, reject) => {
      this.clientPG.query('SELECT * FROM jojo', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }
}
