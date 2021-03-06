import 'dotenv/config';
import express from 'express';
import routes from './routes';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import path from 'path';
import SentryConfig from './config/sentry';


import './database';


class App {

    constructor(){
        this.server = express();

       Sentry.init(SentryConfig);



        this.middlewares();
        this.routes();
        this.ExHandler();
    }

    middlewares(){
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json());
        this.server.use('files',express.static(path.resolve(__dirname,'..','tmp','upload')));

    }

    routes(){
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    ExHandler(){
       this.server.use(async(err,req,res,next) => {
           if(process.env.NODE_ENV == 'development'){
            const errors = await new Youch(err,req).toJSON();

            return res.status(500).json(errors);
           }

           return res.status(500).json({error:'Internal server error'});


   });
       }


}

export default  new App().server;
