/* eslint-disable prettier/prettier */
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TaskService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-tasks.dto";
import { UpdateTaskDto } from "./dto/update-tasks.dto";
import { ResponseTaskDto } from "./dto/response-tasks.dto";

@ApiTags("Task")
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOkResponse({ type: ResponseTaskDto })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOkResponse({ type: [ResponseTaskDto] })
  findAll() {
    return this.taskService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ type: ResponseTaskDto })
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ type: ResponseTaskDto })
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  @ApiOkResponse()
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
