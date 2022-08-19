/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export interface ITask {
  title: string;
  description: string;
}

export type ITaskDoc = Document & ITask;
