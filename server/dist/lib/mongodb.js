"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// MongoDB connection string
const uri = 'mongodb+srv://praveensharma:tPYBtzijGxwxOKCr@cluster0.s075vto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log('MongoDB URI:', uri);
const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};
let client;
let clientPromise;
if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global;
    if (!globalWithMongo._mongoClientPromise) {
        client = new mongodb_1.MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
}
else {
    client = new mongodb_1.MongoClient(uri, options);
    clientPromise = client.connect();
}
exports.default = clientPromise;
