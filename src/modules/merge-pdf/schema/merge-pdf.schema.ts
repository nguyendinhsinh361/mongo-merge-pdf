/* eslint-disable prettier/prettier */
import * as mongoose from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

const DATA_MODEL = "Data";
const DataSchema = new mongoose.Schema(
  {
    payload: [
      {
        type: String,
      }
    ],
  },
  { timestamps: true }
);
DataSchema.plugin(mongoosePaginate);

export { DATA_MODEL, DataSchema };
