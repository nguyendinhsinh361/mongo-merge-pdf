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
import { UploadFileDto } from './dto/uploadFile.dto';
import { MergePdfService } from './merge-pdf.service';
import { Response, urlencoded } from 'express';
import { createReadStream } from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fetch from 'node-fetch';
import { MergePdfDto } from './dto/merge-pdf.dto';
@ApiTags('Merge-Pdf')
@Controller('merge-pdf')
export class MergePdfController {
  constructor(private readonly mergePdfService: MergePdfService) {}

  @Post('/upload-files')
  @ApiOperation({ summary: 'Upload File' })
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
  async uploadAndConvertFilesToPdf(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<any> {
    return this.mergePdfService.uploadAndConvertFilesToPdf(files, uploadFileDto)
  }

  @Post()
  @ApiOperation({ summary: 'Merge PDF' })
  async mergePdf(
    @Body() mergePdfDto: MergePdfDto,
  ): Promise<any> {
    return this.mergePdfService.mergePdf(mergePdfDto)
  }

  @Get('/dowload/:url')
  @HttpCode(HttpStatus.OK)
  @Header('Content-type', 'application/pdf')
  async dowload(
    @Res({ passthrough: true }) res: Response,
    @Param('url') url: string,
  ) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${url.split('/')[url.split('/').length -1]}`,
    });

    const file = createReadStream(join(process.cwd(), url));
    
    return new StreamableFile(file);
  }

}
