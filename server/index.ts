import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import clientPromise from './lib/mongodb';

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let db: any;

async function connectToDatabase() {
  try {
    const client = await clientPromise;
    db = client.db('test'); // Your correct DB from Compass
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}


// API Routes
app.get('/api/approved-notes', async (req: Request, res: Response) => {
 
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
  } catch (error) {
    console.error('Error fetching approved notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approved notes'
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
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