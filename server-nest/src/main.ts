import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || 'localhost';

  await app.listen(port);

  const url = `http://${host}:${port}`;

  console.log(
    chalk.greenBright(`🚀 Servidor rodando em:`),
    chalk.blueBright.bold(url),
  );
}
bootstrap();
