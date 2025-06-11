"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env.local') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./lib/mongodb"));
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
let db;
async function connectToDatabase() {
    try {
        const client = await mongodb_1.default;
        db = client.db('test'); // Your correct DB from Compass
        console.log('✅ MongoDB Connected');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}
// API Routes
app.get('/api/approved-notes', async (req, res) => {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }
        const dummyNote = {
            title: 'Test Note',
            content: 'This is a dummy note for testing.',
            createdAt: new Date(),
            approvedBy: 'tarun.dubey@betaque.com',
        };
        await db.collection('approved').insertOne(dummyNote);
        console.log("1");
        const approvedNotes = await db
            .collection('approved')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        res.json({
            success: true,
            notes: approvedNotes
        });
    }
    catch (error) {
        console.error('Error fetching approved notes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch approved notes'
        });
    }
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Start server
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startServer().catch(console.error);
