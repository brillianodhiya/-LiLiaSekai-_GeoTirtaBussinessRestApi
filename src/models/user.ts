import mongoose from "mongoose";

interface IUser {
  username: string;
  password: string;
  no_hp: any;
  email: string;
  photo: any;
  role: any;
}

interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  no_hp: any;
  email: string;
  photo: any;
  role: any;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    no_hp: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.build = (attr: IUser) => {
  return new Users(attr);
};

const Users = mongoose.model<UserDoc, userModelInterface>("User", userSchema);

export { Users };
