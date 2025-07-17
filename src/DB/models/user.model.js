import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [5, 'Email must be at least 5 characters long'],
    maxlength: [100, 'Email must be at most 100 characters long']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [1024, 'Password must be at most 1024 characters long'],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'],
        max: [60, 'Age must be at most 60'],
        default: 18
    }
},
{
  timestamps: true,
});

const userModel = mongoose.model("user", userSchema);

export default userModel;


userModel.syncIndexes()