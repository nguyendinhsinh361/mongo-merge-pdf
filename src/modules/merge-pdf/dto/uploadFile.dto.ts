/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UploadFileDto {
  @IsOptional()
  @ApiProperty({ type: [String], format: 'binary', required: false })
  payload: string[];
}
