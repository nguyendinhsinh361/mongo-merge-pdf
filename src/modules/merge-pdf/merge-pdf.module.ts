/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DataSchema, DATA_MODEL } from "./schema/merge-pdf.schema";
import { MergePdfController } from "./merge-pdf.controller";
import { MergePdfService } from "./merge-pdf.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DATA_MODEL, schema: DataSchema }]),
  ],
  controllers: [MergePdfController],
  providers: [MergePdfService],
  exports: [],
})
export class MergePdfModule {}