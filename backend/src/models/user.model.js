import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
  name: {
    type: String,
    required: true,
    trim : true, 
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim : true,
    match : [/.+@.+\..+/, 'Please provide a valid email address'],
//here we regex for email validation 
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [50, 'Password cannot exceed 50 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',

  },
},
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);