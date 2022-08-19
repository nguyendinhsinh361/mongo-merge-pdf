/* eslint-disable prettier/prettier */

import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MergePdfDto } from "./dto/merge-pdf.dto";
import { MergePdfService } from "./merge-pdf.service";




@ApiTags("Merge-Pdf")
@Controller("merge-pdf")
export class MergePdfController {
    constructor(private readonly mergePdfService: MergePdfService) {}
    
    @Post()
    @ApiOperation({ summary: 'Merge PDF' })
    async mergePdf(
        @Body() mergePdfDto: MergePdfDto,
    ): Promise<any> {
        // await imagesToPdf(["./upload/pdf/3d2449f48418648c3cdf6bf205821e29.jpg", "./upload/pdf/3d2449f48418648c3cdf6bf205821e29.jpg"], "./upload/pdf/combined.pdf");
        // await imagesToPdf(["./upload/pdf/3d2449f48418648c3cdf6bf205821e29.jpg", "./upload/pdf/3d2449f48418648c3cdf6bf205821e29.jpg"], "./upload/pdf/combined1.pdf");
        return this.mergePdfService.mergePdf(mergePdfDto);
    }

}
