
// export default Username
import React from 'react'
import PaymentPage from '@/Components/PaymentPage'
import { notFound } from "next/navigation"
import mongoose from 'mongoose'
import User from '@/Components/models/User'

// Create a function to ensure database connection
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

const Username = async ({ params }) => {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Check if user exists in database
    // Note: Based on your schema, the field is 'to_user', not 'username'
    const user = await User.findOne({ to_user: params.username }).lean();
    
    if (!user) {
      console.log(`User not found with username: ${params.username}`);
      return notFound();
    }

    // User exists, render the payment page
    return (
      <>
        <PaymentPage username={params.username} />
      </>
    );

  } catch (error) {
    console.error("Error checking user:", error);
    // In case of database errors, you might want to show an error page
    // or return notFound() depending on your preference
    return notFound();
  }
}

export default Username

export async function generateMetadata({ params }) {
  try {
    // Optionally, you can fetch user data here to create more dynamic metadata
    await connectToDatabase();
    const user = await User.findOne({ to_user: params.username }).lean();
    
    if (user) {
      return {
        title: `Support ${user.name || params.username} - Get Me A Chai`,
        description: `Support ${user.name || params.username} by buying them a chai. Every contribution counts!`,
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback metadata
  return {
    title: `Support ${params.username} - Get Me A Chai`,
    description: `Support ${params.username} by buying them a chai. Every contribution counts!`,
  }
}