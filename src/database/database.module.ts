import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
// libreria para conectar postgres
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SAaaaaa';

const client = new Client ({
  user:'root',
  host:'localhost',
  database:'my_db',
  password: '123456',
  port:5432,
});

client.connect();

// client.query('SELECT * FROM jojo', (err,res) => {
//   console.error(err);
//   console.log(res.rows);
// });

// Es un decorador que se usa para indicar que el modulo es global, y va a permitir que cualquier modulo pueda usarlo
@Global()
@Module({
  imports: [
    // se le coloca el Async para que pueda leer el config porque tenemos que inyectarlo en el useFactory
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.postgres; //destructuring
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
          // esto hara que se sincronicen nuestras entidades con la base de datos pero en produccion debe de estar en false
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      //Permite codigo asincrono y tambien hacer inyeccion de dependencias que e slo queremos hacer en el modulo
      useFactory: (configService:ConfigType<typeof config>) => {
        //const {user,host,dbName,password,port} = configService.postgres; puedo hacer un destructuring para no tener que poner configService.postgres.user
        const client = new Client ({
          user:configService.postgres.user,
          host:configService.postgres.host,
          database:configService.postgres.dbName,
          password: configService.postgres.password,
          port:configService.postgres.port,
        });
        client.connect();
        return client;
      },
      //.KEY para poder leer el config
      inject: [config.KEY],
    },
  ],
  // aqio ;e decops que apiKey pueda ser usado desde cualquier modulo sin necesidad de importarlo en el modulo que quiera usarlo sencillamente inyectarlo
  exports: ['API_KEY', 'PG', TypeOrmModule],
  // ojo hay que exportar typeormmodule para que pueda ser usado en otros modulos
})
export class DatabaseModule {}
