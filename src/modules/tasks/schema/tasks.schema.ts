/* eslint-disable prettier/prettier */
import * as mongoose from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

const TASK_MODEL = "Task";
const TaskSchema = new mongoose.Schema(
  {
    title: {
      require: true,
      type: String,
    },

    description: {
      require: true,
      type: String,
    },
  },
  { timestamps: true }
);
TaskSchema.plugin(mongoosePaginate);

export { TASK_MODEL, TaskSchema };
