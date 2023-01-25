// esta seria nuestra entidad de items de ordenes, es decir una tabla tercera o ternaria que relaciona a las otras dos tablas
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  //debido a que este es el campo adicional de la tabla ternaria, es por eso que creamos nosotros la entitiy para poder personlizar la tabla y no la que nos da typeOrm por defecto
  @Column({ type: 'int' })
  quantity: number;

  //Muchos items pertenecen a un producto
  @ManyToOne(() => Product)
  product: Product;

  //Muchos items pertenecen a una orden
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
