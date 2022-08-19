/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskService } from "./tasks.service";
import { TaskSchema, TASK_MODEL } from "./schema/tasks.schema";
import { TaskController } from "./tasks.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TASK_MODEL, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
