import FundRaiser from "models/FundRaiser";
import User from "models/User";
import mongoose from "mongoose";

const { MONGODB_URL } = process.env;
let connection: Promise<typeof mongoose> | null = null;

const dbConnect = async () => {
  if (connection == null) {
    connection = mongoose.connect(MONGODB_URL!, {
      serverSelectionTimeoutMS: 5000,
    });

    await connection;
  }

  User.init();
  FundRaiser.init();

  return connection;
};

export default dbConnect;
