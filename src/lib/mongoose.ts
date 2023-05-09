import mongoose from "mongoose";

export function mongooseConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Mongodb url not found");
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose.connect(uri);
  }
}
