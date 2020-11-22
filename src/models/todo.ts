import mongoose from "mongoose";

interface ITodo {
  title: string;
  description: string;
}

// change generic <any> with TodoDoc
interface TodoDoc extends mongoose.Document {
  title: string;
  description: string;
}

// declare to make mongoose can use model

// interface todoModelInterface extends mongoose.Model<any> {
interface todoModelInterface extends mongoose.Model<TodoDoc> {
  build(attr: ITodo): TodoDoc;
}

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// declare that interface for attr models
todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr);
};

// call interface model if using build, or any using todoschema
const Todo = mongoose.model<TodoDoc, todoModelInterface>("Todo", todoSchema);

// using build
// Todo.build({
//   title: "some title",
//   description: "some description",
// });

export { Todo };
