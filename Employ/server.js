import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0/MamaGen1')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trimester: Number,
  age: Number,
  bmi: Number,
  medicalConditions: Boolean,
  fitnessLevel: Number,
  previousPregnancies: Number,
  recommendation: String,
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

// MongoDB Models
const User = mongoose.model('User', userSchema);
const Recommendation = mongoose.model('Recommendation', recommendationSchema);
const Message = mongoose.model('Message', messageSchema);

// Llama AI Integration
const apiKey = process.env.GROQ_API_KEY; // Store your API key in .env file
const groq = new Groq({ apiKey });

// API Routes

// Chat route
app.post("/api/chat", async (req, res) => {
  const { messages, userId } = req.body; // Expect userId in the request

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.2-90b-vision-preview", // Specify the desired model
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Process the chat response and save the recommendation
    let recommendationText = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      recommendationText += content; // Append content
      res.write(content);
    }

    // Save recommendation to the database
    const recommendation = new Recommendation({
      userId, // Ensure userId is linked
      recommendation: recommendationText,
    });
    await recommendation.save();

    res.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong");
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store a new recommendation
app.post('/api/recommendations', async (req, res) => {
  try {
    const { userId, trimester, age, bmi, medicalConditions, fitnessLevel, previousPregnancies } = req.body;

    // Log request body for debugging
    console.log('Recommendation Request:', req.body);

    // Assuming you get a recommendation string from the Groq API or some logic
    const recommendationText = "Sample recommendation based on user data.";

    const recommendation = new Recommendation({
      userId,
      trimester,
      age,
      bmi,
      medicalConditions,
      fitnessLevel,
      previousPregnancies,
      recommendation: recommendationText // Sample recommendation here
    });

    await recommendation.save();

    res.status(201).json({
      message: 'Recommendation saved successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error saving recommendation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recommendations for a user
app.get('/api/recommendations/:userId', async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.params.userId });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store a new message
app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a user
app.get('/api/messages/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use PORT from environment variable
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
