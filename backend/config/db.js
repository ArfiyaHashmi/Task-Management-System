// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("Database connected successfully");
      // Log collections to verify
      mongoose.connection.db.listCollections().toArray(function (err, collections) {
        console.log('Collections:', collections.map(c => c.name));
      });
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;