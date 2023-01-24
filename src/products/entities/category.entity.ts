import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

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

  // Relacion de muchos a muchos, es decir una categoria tiene muchos productos y un producto tiene muchas categorias
  // El () => Product es para que sepa que es una entidad de la base de datos
  // El (product) => product.categories es para que sepa que es una relacion de muchos a muchos, es decir una categoria tiene muchos productos y un producto tiene muchas categorias
  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
