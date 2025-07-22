import mongoose from "mongoose";
import User from "@/Components/models/User";
import { NextResponse } from "next/server";

// Database connection function
async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/getmeachai", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Generate unique to_user
    let toUser = email.split('@')[0].toLowerCase();
    const existingToUser = await User.findOne({ to_user: toUser });
    if (existingToUser) {
      // Add random number if to_user already exists
      toUser = `${toUser}${Math.floor(Math.random() * 1000)}`;
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: password,
      to_user: toUser,
      isOAuthUser: false
    });

    await newUser.save();

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          to_user: newUser.to_user
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}