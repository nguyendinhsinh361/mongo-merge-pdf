/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { ConsoleLogger, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
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
    async uploadAndConvertFilesToPdf(files: Array<Express.Multer.File>, mergePdfDto: MergePdfDto): Promise<any> {
        const { payload } = mergePdfDto;
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
        return pdfArr;
    }

    async mergePdf(files: Array<Express.Multer.File>, mergePdfDto: MergePdfDto) {
        
        const pdfArr  = await this.uploadAndConvertFilesToPdf(files, mergePdfDto);
        const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
        const resultUrl =  `./src/data-pdf/${randomName}.pdf`;
        
        return new Promise((resolve, reject) => {
            setTimeout(async() => {
                const PDFMerger = require('pdf-merger-js');
                const merger = new PDFMerger();
                await (async () => {
                    for(const res of pdfArr) {
                        await merger.add(res);
                    }
                    await merger.save(resultUrl);
                })()
                resolve(resultUrl);
            }, 1000)
          });
    }

}
