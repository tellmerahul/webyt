import mongoose from "mongoose";

const connect = {};
export async function mongoConnect() {
    if (connect.isConnected) {
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        connect.isConnected = db.connection.readyState;
        console.log("Connection Successful...");
    } catch (err) {
        console.error(err);
        throw new Error("MongoDB connection error");
    }
}