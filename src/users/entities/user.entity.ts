import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  //usados para las relaciones 1 a 1
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Customer } from './customer.entity';

// Decorador que indica que es una entidad de la base de datos
@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string; // encript, deberia ser encriptado

  @Column({ type: 'varchar', length: 100 })
  role: string;

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

  // Relacion 1 a 1 con la entidad customer
  // nullable: true porque no todos los usuarios son clientes
  // JoinColumn es para que se cree una columna en la tabla de customer que se llame user_id y que sea la primary key de la tabla user
  // es decir que se cree una relacion entre las tablas user y customer
  @OneToOne(() => Customer, (customer) => customer.user, { nullable: true })
  @JoinColumn()
  customer: Customer;
}
