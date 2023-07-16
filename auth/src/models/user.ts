import mongoose from "mongoose";
import { hashPassword } from "../services/hash-password";

// Interface defining properties required for new User
interface UserAttrs {
  email: string;
  password: string;
}

// interface for building a new User with custom function 'build'
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface defines properties of a single User Document:ex. user.email, user.password
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// define schema for User
const userSchema = new mongoose.Schema({
  email: {
    type: String, // refers to String class constructor
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// integrate hash service for passwords passed for new Users
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    // retrieve password from document and pass to create hash method
    const hashed = await hashPassword.createHash(this.get("password"));
    // update password in document
    this.set("password", hashed);
  }
  done();
});

// integrate custom function 'build' as a property for use within User object
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Generics '<UserDoc, UserModel>' allow custom types within models
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
