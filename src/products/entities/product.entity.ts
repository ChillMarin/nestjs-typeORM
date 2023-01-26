import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  JoinColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

// Decorador que indica que es una entidad de la base de datos
@Entity({name: 'products'})
@Index(['price', 'stock'])
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
    name: 'created_at',
    type: 'timestamptz',
    // el default es para que se llene automaticamente con la fecha actual
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  // Columna que se va a llenar automaticamente con la fecha de actualizacion
  @UpdateDateColumn({
    name: 'updated_at',
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
  //ojo agregamos el JoinColoum solo porque queremos cambiarle el nombre en la bd
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // Relacion de muchos a muchos, es decir un producto puede pertenecer a muchas categorias y una categoria puede tener muchos productos
  // El () => Category es para que sepa que es una entidad de la base de datos
  // El (category) => category.products es para que sepa que es una relacion de muchos a muchos, es decir un producto puede pertenecer a muchas categorias y una categoria puede tener muchos productos, y esto hace que sea una relacion bidireccional y guarde las relaciones en la ttabla product_category
  // No es necesario poner el JoinColumn automaticamente sabe que el que tiene el decorador ManyToMany es el que tiene la llave foranea, en el caso pasado de 1a1 si era necesario poner el JoinColumn
  @ManyToMany(() => Category, (category) => category.products)
  // El JoinTable es para que sepa que la tabla que va a guardar las relaciones es product_category y solo debe ir en el ManyToMany que tiene la llave foranea es decir puedo elegir cual debe de tenerlo segun sea el caso y esto crea la tabla product_cagories_category
  @JoinTable({
    // El name es para que sepa que la tabla que va a guardar las relaciones es product_category
    name: 'product_categories',
    // El joinColumn es para que sepa que la columna que va a guardar el id del producto es product_id etc
    joinColumn: {
      // la primera es la columna de la tabla actual
      name: 'product_id',
    },
    // El inverseJoinColumn es para que sepa que la columna que va a guardar el id de la categoria es category_id etc
    inverseJoinColumn: {
      // la segunda es la columna de la tabla que se relaciona
      name: 'category_id',
    },
  })
  categories: Category[];

}
