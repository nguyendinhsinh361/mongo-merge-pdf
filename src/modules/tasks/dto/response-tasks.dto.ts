/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, IsOptional } from "class-validator";
import { ITask } from "../interface/tasks.interface";

export class ResponseTaskDto implements ITask {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}
