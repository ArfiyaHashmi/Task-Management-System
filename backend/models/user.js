// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manager', 'employee', 'client'],
    required: true,
  },
  // Add other relevant fields like registration date, etc.
});

const User = mongoose.model('User', UserSchema);

export default User;