import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Add this import - it was missing!

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        default: ''
    },
    to_user: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            // Only require password for non-OAuth users
            return !this.isOAuthUser;
        }
    },
    // Add this field to distinguish OAuth users
    isOAuthUser: {
        type: Boolean,
        default: false
    },
    profilepic: {
        type: String,
        default: ''
    },
    coverpic: {
        type: String,
        default: ''
    },
    razorpayid: {
        type: String,
        default: ''
    },
    razorpaysecret: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ to_user: 1 });

UserSchema.pre('save', async function (next) {
    // Hash password only if it's modified and not empty
    if (this.isModified('password') && this.password) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    
    // Ensure to_user is set
    if (!this.to_user && this.email) {
        this.to_user = this.email.split('@')[0].toLowerCase();
    }
    
    next();
});

// Instance method to check password
UserSchema.methods.verifyPassword = function (candidatePassword) {
    if (!this.password) return false; // No password set
    return bcrypt.compare(candidatePassword, this.password);
};

// Use a singleton pattern to avoid overwriting the model
const User = mongoose.models.User || model("User", UserSchema);

export default User;