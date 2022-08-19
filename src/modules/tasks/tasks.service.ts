/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
// import { PaginateModel } from 'mongoose-paginate-v2';
import { CreateTaskDto } from "./dto/create-tasks.dto";
import { UpdateTaskDto } from "./dto/update-tasks.dto";
import { TASK_MODEL } from "./schema/tasks.schema";
import { ITaskDoc } from "./interface/tasks.interface";

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TASK_MODEL)
    private readonly taskModel: mongoose.PaginateModel<ITaskDoc>
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.taskModel.create(createTaskDto);
  }

  findAll() {
    return this.taskModel.find();
  }

  async findOne(id: string) {
    const checkTask = await this.taskModel.findById(id).exec();
    if (!checkTask) {
      throw new NotFoundException();
    } else {
      return checkTask;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findByIdAndUpdate(
      { _id: id },
      updateTaskDto,
      { returnNewDocument: true }
    );
    if (!task) {
      throw new NotFoundException();
    } else {
      return task;
    }
  }

  async remove(id: string) {
    const task = await this.taskModel.findOneAndDelete({ _id: id });
    if (!task) throw new NotFoundException();
  }
}
