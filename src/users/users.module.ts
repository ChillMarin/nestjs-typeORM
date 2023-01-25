import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './services/users/users.service';
import { CustomersService } from './services/customers/customers.service';

import { ProductsModule } from '../products/products.module';
import { UsersController } from './controllers/users.controller';

import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';
import { CustomerController } from './controllers/customers.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  controllers: [UsersController, CustomerController],
  providers: [UsersService, CustomersService],
  // typeorm module for feature, para que sepa que entidades va a usar de products y que las va a importar de la carpeta entities de products
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([User, Customer, Order, OrderItem]),
  ],
})
export class UsersModule {}
