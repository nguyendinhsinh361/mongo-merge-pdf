/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { MergePdfDto } from './dto/merge-pdf.dto';
import { MergePdfService } from './merge-pdf.service';
import { Response, urlencoded } from 'express';
import { createReadStream } from 'fs';
@ApiTags('Merge-Pdf')
@Controller('merge-pdf')
export class MergePdfController {
  constructor(private readonly mergePdfService: MergePdfService) {}

  @Post()
  @ApiOperation({ summary: 'Merge PDF' })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/src',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async mergePdf(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() mergePdfDto: MergePdfDto,
  ): Promise<any> {
    return this.mergePdfService.mergePdf(files, mergePdfDto)
  }

  @Get('/dowload/:url')
  @HttpCode(HttpStatus.OK)
  @Header('Content-type', 'application/pdf')
  async dowload(
    @Res({ passthrough: true }) res: Response,
    @Param('url') url: string,
  ) {
    const file = createReadStream(join(process.cwd(), url));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${url.split('/')[url.split('/').length -1]}`,
    });
    return new StreamableFile(file);
  }

}
