import mongoose from "mongoose";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/Components/models/User";

// Ensure database connection
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

const handler = NextAuth({
  providers: [
    // Credentials (email + password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await User.findOne({ email: credentials.email.toLowerCase() });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if this is an OAuth user trying to login with credentials
          if (user.isOAuthUser) {
            throw new Error("This account was created with social login. Please use Google or GitHub to sign in.");
          }

          const isValid = await user.verifyPassword(credentials.password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            to_user: user.to_user
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    }),

    // GitHub OAuth
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  pages: {
    signIn: "/Login",
    error: "/Login"
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", user.email, account.provider);
      try {
        await connectToDatabase();

        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser && account.provider !== "credentials") {
          // Create new OAuth user
          const toUser = user.email.split('@')[0].toLowerCase();

          // Check if to_user already exists
          let uniqueToUser = toUser;
          const existingToUser = await User.findOne({ to_user: toUser });
          if (existingToUser) {
            uniqueToUser = `${toUser}${Math.floor(Math.random() * 1000)}`;
          }

          existingUser = await User.create({
            email: user.email,
            password: "",
            to_user: uniqueToUser,
            name: user.name || uniqueToUser,
            isOAuthUser: true
          });
        }

        return true;
      } catch (err) {
        console.error("SignIn callback error:", err);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.to_user = user.to_user;
      }

      // Always fetch fresh user data from database
      if (token.email) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.to_user = dbUser.to_user;
            token.id = dbUser._id.toString();
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.to_user = token.to_user;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };