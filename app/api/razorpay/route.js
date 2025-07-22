import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/Components/models/Payment";
import User from "@/Components/models/User";
import mongoose from "mongoose";

// Create a function to ensure database connection
async function connectToDatabase() {
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        await mongoose.connect("mongodb://localhost:27017/getmeachai", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export const POST = async (req) => {
    try {
        await connectToDatabase();

        const body = await req.json();

        console.log("Payment callback received:", body);
        console.log("Razorpay callback body:", body);
        console.log("Looking for order ID:", body.razorpay_order_id);

        // 1. Find payment
        let p = await Payment.findOne({ oid: body.razorpay_order_id });
        if (!p) {
            console.error("Payment not found for order ID:", body.razorpay_order_id);
            return NextResponse.json({ success: false, message: "Order Id not found" });
        }

        console.log("Payment found:", { oid: p.oid, to_user: p.to_user, amount: p.amount });

        // 2. Find user by to_user field (this matches your User schema)
        let user = await User.findOne({ to_user: p.to_user });

        if (!user) {
            console.error(`User not found for to_user: ${p.to_user}`);
            return NextResponse.json({
                success: false,
                message: "User not found",
                debug: {
                    providedToUser: p.to_user,
                    trimmed: p.to_user.trim(),
                    lowercase: p.to_user.toLowerCase()
                }
            });
            
        }

        console.log("User found:", {
            to_user: user.to_user,
            email: user.email,
            hasRazorpaySecret: !!user.razorpaysecret,
            secretLength: user.razorpaysecret ? user.razorpaysecret.length : 0
        });

        // 3. Get the secret - use environment variable as fallback
        let secret = user.razorpaysecret || process.env.KEY_SECRET;

        if (!secret) {
            console.error("No Razorpay secret found - neither in user record nor environment");
            return NextResponse.json({
                success: false,
                message: "Payment verification failed - configuration error",
                debug: {
                    userHasSecret: !!user.razorpaysecret,
                    envHasSecret: !!process.env.KEY_SECRET
                }
            });
        }

        console.log("Using secret source:", user.razorpaysecret ? "user" : "environment");

        // 4. Verify payment
        const isValid = validatePaymentVerification(
            {
                "order_id": body.razorpay_order_id,
                "payment_id": body.razorpay_payment_id
            },
            body.razorpay_signature,
            secret
        );

        console.log("Payment verification result:", isValid);


        if (isValid) {
            // Update payment status
            const updatedPayment = await Payment.findOneAndUpdate(
                { oid: body.razorpay_order_id },
                {
                    done: true,
                    razorpay_payment_id: body.razorpay_payment_id,
                    razorpay_signature: body.razorpay_signature
                },
                { new: true }
            );

            console.log("Payment marked as completed");
            console.log("Payment update result:", {
                found: !!updatedPayment,
                oid: updatedPayment?.oid,
                done: updatedPayment?.done,
                doneType: typeof updatedPayment?.done
            });
            if (!updatedPayment) {
                console.error("Failed to update payment - payment not found");
                return NextResponse.json({
                    success: false,
                    message: "Failed to update payment status"
                });
            }


            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${p.to_user}?paymentdone=true`);
        } else {
            console.error("Payment verification failed");
            return NextResponse.json({
                success: false,
                message: "Payment Verification Failed"
            });
        }

    } catch (error) {
        console.error("Payment processing error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};