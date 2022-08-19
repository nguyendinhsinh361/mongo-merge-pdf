/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export interface IData {
  payload: string[];
}

export type IDataDoc = Document & IData;
