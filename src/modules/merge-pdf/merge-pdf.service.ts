/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { UploadFileDto } from "./dto/uploadFile.dto";
import { IDataDoc } from "./interface/merge-pdf.interface";
import { DATA_MODEL } from "./schema/merge-pdf.schema";
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { MergePdfDto } from "./dto/merge-pdf.dto";

@Injectable()
export class MergePdfService { 
    constructor(
        @InjectModel(DATA_MODEL)
        private readonly dataModel: mongoose.PaginateModel<IDataDoc>
    ) {}
    async uploadAndConvertFilesToPdf(files: Array<Express.Multer.File>, uploadFileDto: UploadFileDto): Promise<any> {
        const { payload } = uploadFileDto;
        const data = await this.dataModel.create({ payload: null })
        const dataT = [];
        const pdfArr = [];
        if(files.length != 0) {
            
            files.forEach(file => {
                if (fs.existsSync(data._id)) {
                    fs.unlinkSync(`./${data._id}`);
                }
                dataT.push(file.path);
            })
            data.payload = dataT;
            await data.save();
        }
        
            
        for(const res of dataT) {
            if(!res.includes('.pdf')) {
                const doc = new PDFDocument();
                doc.pipe(fs.createWriteStream(`${res.split('.')[0]}.pdf`));
                await doc.image(res, {
                    fit: [250, 300],
                    align: 'center',
                    valign: 'center'
                  })
                await doc.end();
                pdfArr.push(`${res.split('.')[0]}.pdf`)
            }else {
                pdfArr.push(res);
            }
            
        }
        await pdfArr;
        return JSON.stringify(pdfArr);
    }

    async mergePdf(mergePdfDto: MergePdfDto) {
        const { files } = mergePdfDto
        const PDFMerger = require('pdf-merger-js');
        let resultUrl = '1';
        const merger = new PDFMerger();
        await (async () => {
            for(const res of files) {
                await merger.add(res);
            }
            const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
            resultUrl =  `./pdf/${randomName}.pdf`;
            await merger.save(`./pdf/${randomName}.pdf`);
            return resultUrl;
        })().then(res => {
            resultUrl = res
        })
        return {
            message: "Merge Successfully",
            data: resultUrl
        }
    }

}
