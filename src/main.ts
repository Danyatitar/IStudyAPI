import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import * as express from 'express';
// import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';

// const expressApp = express();

// async function bootstrap(expressInstance: express.Express) {
//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(expressInstance),
//   );

//   app.enableCors({
//     // Ensure that your CORS settings are configured correctly for your Vercel deployment.
//     origin: 'http://localhost:4200', // or specify origins you want to allow
//     credentials: true,
//     exposedHeaders: ['Content-Disposition'],
//   });

//   app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
//   app.use(cookieParser());

//   await app.init();
// }

// bootstrap(expressApp);

// export default expressApp;
