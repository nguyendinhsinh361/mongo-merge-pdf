/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { MergePdfDto } from "./dto/merge-pdf.dto";
import { IDataDoc } from "./interface/merge-pdf.interface";
import { DATA_MODEL } from "./schema/merge-pdf.schema";
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class MergePdfService { 
    constructor(
        @InjectModel(DATA_MODEL)
        private readonly dataModel: mongoose.PaginateModel<IDataDoc>
    ) {}
    async mergePdf(files: Array<Express.Multer.File>, mergePdfDto: MergePdfDto): Promise<any> {
        const { payload } = mergePdfDto;
        const PDFMerger = require('pdf-merger-js');
        const data = await this.dataModel.create({ payload: null })
        const dataT = [];
        let imageToPdf = null;
        const pdfArr = [];
        if(files.length != 0) {
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(`./uploads/src/${data._id}.pdf`));
            if (files) {
                files.forEach(file => {
                    if (fs.existsSync(data._id)) {
                        fs.unlinkSync(`./${data._id}`);
                    }
                    dataT.push(file.path);
                })
                data.payload = dataT;
            }
            await data.save();
            
            dataT.forEach((res, index) => {
                if(!res.includes('.pdf')) {
                    doc.image(res, {
                        fit: [250, 300],
                        align: 'center',
                        valign: 'center'
                    })
                    imageToPdf = (`./${res.split('\\')[0]}/${res.split('\\')[1]}/${data._id}.pdf`);
                }else {
                    pdfArr.push(`./${res.split('\\')[0]}/${res.split('\\')[1]}/${res.split('\\')[2]}`);
                }
            })
            await doc.end();
            if(imageToPdf != null) pdfArr.push(imageToPdf);
            await pdfArr;
            const merger = new PDFMerger();
            (async () => {
                await merger.add('./blank/Blank.pdf');
                
                for(const res of pdfArr) {
                    await merger.add(res);
                }
    
                    
                await merger.save(`./pdf/${data._id}.pdf`); 
            })();

        }
    
        return {
            message: "Merge successfully",
            pdfArr
        }
    }
}
