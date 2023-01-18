import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador que indica que es una entidad de la base de datos
@Entity()
export class Product {
  //Premary key autoincrementable
  @PrimaryGeneratedColumn()
  id: number;

  //Columna de tipo varchar, no nula, con longitud de 100 y que su valor sea unico, es decir no pueden haber 2 con el mismo nombre
  @Column({type: 'varchar', length: 255, nullable: false, unique: true})
  name: string;

  // Columna tipo varchar, sin limite de texto, no nula
  @Column({type: 'text', nullable: false})
  description: string;

  @Column({type:'int'})
  price: number;

  @Column({type:'int'})
  stock: number;

  @Column({type:'varchar'})
  image: string;
}
