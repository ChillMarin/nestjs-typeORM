import { registerAs } from '@nestjs/config';

// todo esto se hace para poder tener un archivo de configuracion el cual no haga un formating de las variables de entorno y no tener errores de tipo
export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    postgres: {
      dbName: process.env.POSTGRES_DB,
      // le coloco un parseInt para evitar errores y que sea base 10
      port: parseInt(process.env.POSTGRES_PORT, 10),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
    },
    apiKey: process.env.API_KEY,
  };
});
