import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
// este es el tipado para la libreria de postgres
import { Client } from 'pg';
// no se usa corchetes porque tiene un export default
import config from './config';

@Injectable()
export class AppService {
  constructor(
    //@Inject('API_KEY') private apiKey: string,
    //@Inject('TASKS') private tasks: any[], // 👈 inject TASKS
    @Inject('PG') private clientPG: Client,
    @Inject(config.KEY) private configService: ConfigType<typeof config>, // 👈 inject configService
  ) {}

  getHello(): string {
    // console.log(this.tasks); // 👈 print TASKS
    const apiKey = this.configService.apiKey;
    const name = this.configService.database.name;
    return `Hello Wrorld!23 gsr ${apiKey} and ${name}`;
  }

  //nestjs siempre necesita un retorno por eso lo hacemos como una promesa para que no haga un callback
  // En NEstjs todo deberia ser manejado por promesas o observables
  getJojos() {
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
