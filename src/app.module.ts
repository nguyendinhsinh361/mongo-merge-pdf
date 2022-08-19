/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MergePdfModule } from './modules/merge-pdf/merge-pdf.module';
import { TaskModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/mongodb-nestjs'),
    TaskModule,
    MergePdfModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
