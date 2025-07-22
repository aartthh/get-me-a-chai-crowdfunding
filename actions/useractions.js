"use server"
import Razorpay from "razorpay";
import Payment from "@/Components/models/Payment";
import mongoose from "mongoose";
import User from "@/Components/models/User";

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

export const initiate = async (amount, to_username, paymentForm) => {
    try {
        await connectToDatabase();

        // Debug: Check if environment variables are loaded
        console.log("KEY_ID:", process.env.KEY_ID);
        console.log("KEY_SECRET:", process.env.KEY_SECRET ? "Present" : "Missing");

        if (!process.env.KEY_ID || !process.env.KEY_SECRET) {
            throw new Error("Razorpay credentials not found in environment variables");
        }

        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        const options = {
            amount: Number.parseInt(amount) * 100, // Amount in paise
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        // Create payment record with pending status
        await Payment.create({
            oid: order.id,
            amount: amount,
            to_user: to_username,
            name: paymentForm.name || 'Anonymous',
            message: paymentForm.message || 'Thank you for your support!',
            done: false, // Initially false until payment is completed
            createdAt: new Date(),
        });

        // Return a plain object - convert Razorpay order to plain object
        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            status: order.status,
            created_at: order.created_at,
            key_id: process.env.KEY_ID, // Safe to send key_id to client
        };

    } catch (error) {
        console.error("Error initiating payment:", error);
        throw new Error("Payment initiation failed: " + error.message);
    }
};

export const fetchuser = async (identifier) => {
    try {
        await connectToDatabase();

        if (!identifier) {
            console.log("No identifier provided");
            return null;
        }

        // First try to find by to_user (username field in your schema)
        let u = await User.findOne({ to_user: identifier }).lean();

        // If not found by to_user, try by email
        if (!u) {
            u = await User.findOne({ email: identifier }).lean();
        }

        // If still not found, try by name
        if (!u) {
            u = await User.findOne({ name: identifier }).lean();
        }

        if (!u) {
            console.log(`User not found with identifier: ${identifier}`);
            return null;
        }

        return {
            ...u,
            _id: u._id.toString(),
            username: u.to_user, // Map to_user to username for consistency
        };

    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user: " + error.message);
    }
};

export const fetchPayments = async (username) => {
    try {
        await connectToDatabase();

        if (!username) {
            console.log("No username provided for fetchPayments");
            return [];
        }

        let payments = await Payment.find({
            to_user: username,
            done: true  // Only show successful payments
        })
            .sort({ amount: -1, createdAt: -1 }) // Sort by amount desc, then by date desc
            .lean();

        console.log(`Found ${payments.length} successful payments for user: ${username}`);

        // Convert ObjectIds to strings and ensure all required fields exist
        return payments.map(payment => ({
            ...payment,
            _id: payment._id.toString(),
            name: payment.name || 'Anonymous',
            message: payment.message || 'Thank you for your support!',
            amount: payment.amount || 0,
        }));

    } catch (error) {
        console.error("Error fetching payments:", error);
        throw new Error("Failed to fetch payments: " + error.message);
    }
};

export const updateProfile = async (data) => {
    await connectToDatabase();

    const { name, email, username, profilepic, coverpic, razorpayid, razorpaysecret, oldUsername } = data;
    const newUsername = username;

    // Get the current user to find their current username
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
        return { error: "User not found" };
    }

    const actualOldUsername = oldUsername || currentUser.to_user;
    console.log(`Updating user: ${actualOldUsername} -> ${newUsername}`);

    // 1) Prevent duplicate username (only if username is actually changing)
    if (actualOldUsername !== newUsername) {
        const exists = await User.findOne({ to_user: newUsername });
        if (exists) return { error: "Username already exists" };
    }

    // 2) Update the user document
    const userResult = await User.updateOne(
        { email },
        { 
            $set: { 
                name: name || '',
                to_user: newUsername,
                profilepic: profilepic || '',
                coverpic: coverpic || '',
                razorpayid: razorpayid || '',
                razorpaysecret: razorpaysecret || ''
            } 
        }
    );

    if (userResult.matchedCount === 0) {
        return { error: "User not found" };
    }

    // 3) CRITICAL: Transfer all payments from old username to new username
    if (actualOldUsername !== newUsername) {
        console.log(`Transferring payments from "${actualOldUsername}" to "${newUsername}"`);
        
        const paymentUpdateResult = await Payment.updateMany(
            { to_user: actualOldUsername },
            { $set: { to_user: newUsername } }
        );
        
        console.log(`Successfully updated ${paymentUpdateResult.modifiedCount} payment records`);
    }

    return { success: true };
};

// Helper function to update payment status after successful payment
export const updatePaymentStatus = async (orderId, paymentId, signature) => {
    try {
        await connectToDatabase();

        // Verify payment signature here if needed
        // For now, we'll just update the payment status

        const result = await Payment.updateOne(
            { oid: orderId },
            {
                done: true,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
                updatedAt: new Date()
            }
        );

        if (result.matchedCount === 0) {
            throw new Error("Payment record not found");
        }

        return { success: true };

    } catch (error) {
        console.error("Error updating payment status:", error);
        throw new Error("Failed to update payment status: " + error.message);
    }
};