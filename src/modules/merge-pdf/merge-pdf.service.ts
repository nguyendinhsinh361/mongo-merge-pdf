/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { MergePdfDto } from "./dto/merge-pdf.dto";
import { IDataDoc } from "./interface/merge-pdf.interface";
import { DATA_MODEL } from "./schema/merge-pdf.schema";

import * as mergePDFs from 'merge-multiple-pdfs';
import * as imagesToPdf from 'images-to-pdf'
// import { PaginateModel } from 'mongoose-paginate-v2';


@Injectable()
export class MergePdfService {
    constructor(
        @InjectModel(DATA_MODEL)
        private readonly dataModel: mongoose.PaginateModel<IDataDoc>
    ) {}
    async mergePdf(mergePdfDto: MergePdfDto): Promise<any> {
        const filesPathArrayT = mergePdfDto.payload.map(res => res.split('/')[res.split('/').length - 1]); 
        console.log(filesPathArrayT)
        const filesPathArray = filesPathArrayT.map((res) => {
            if(!res.includes('.pdf')) {
                imagesToPdf([`./upload/pdf/${res}`], `./upload/pdf/${res.split('.')[0]}.pdf`);
                return `./upload/pdf/${res.split('.')[0]}.pdf`;
            }else {
                return `./upload/pdf/${res}`;
            }
        }); 
        await mergePDFs.appendPdf(filesPathArray, `./upload/pdf/output.pdf`);
        const data = await this.dataModel.create(mergePdfDto)
        return {
            message: "Merge Succesfully",
            data
        };
    }
}
