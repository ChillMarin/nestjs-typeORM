import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Brand } from './brand.entity';

// Decorador que indica que es una entidad de la base de datos
@Entity()
export class Product {
  //Premary key autoincrementable
  @PrimaryGeneratedColumn()
  id: number;

  //Columna de tipo varchar, no nula, con longitud de 100 y que su valor sea unico, es decir no pueden haber 2 con el mismo nombre
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  // Columna tipo varchar, sin limite de texto, no nula
  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  // Columna que se va a llenar automaticamente con la fecha de creacion
  // e; timestampz es para que guarde la hora en UTC y no en la hora local, para que no haga eso le quitamos la tz
  @CreateDateColumn({
    type: 'timestamptz',
    // el default es para que se llene automaticamente con la fecha actual
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  // Columna que se va a llenar automaticamente con la fecha de actualizacion
  @UpdateDateColumn({
    type: 'timestamptz',
    // el default es para que se llene automaticamente con la fecha actual
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  // Relacion de muchos a uno, es decir un producto pertenece a una marca
  // El () => Brand es para que sepa que es una entidad de la base de datos
  // El (brand) => brand.products es para que sepa que es una relacion de muchos a uno, es decir un producto pertenece a una marca y esto hace que sea una relacion bidireccional
  // No es necesario poner el JoinColumn automaticamente sabe que el que tiene el decorador ManyToOne es el que tiene la llave foranea, en el caso pasado de 1a1 si era necesario poner el JoinColumn
  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;
}
