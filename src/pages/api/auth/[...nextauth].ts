import User from "models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "utils/dbConnect";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.id = token.sub;
      return session;
    },
    async signIn({ user }) {
      await dbConnect();
      try {
        await User.findOneAndUpdate(
          {
            googleId: user.id,
          },
          {
            googleId: user.id,
            name: user.name,
            email: user.email,
            picture: user.image,
          },
          { upsert: true, new: true }
        );

        return true;
      } catch (error) {
        return false;
      }
    },
  },
});
