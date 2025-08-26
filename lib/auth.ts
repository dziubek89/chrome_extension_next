import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/utils/mongo/mongoDbClient";
import User from "@/models/user"; // <- Twój model użytkownika
import { connectToDB } from "@/utils/mongo/database";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Dodajemy accessToken do tokena JWT
    async jwt({ token, account }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      // Upewniamy się, że mamy dane użytkownika w tokenie
      await connectToDB();
      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.plan = dbUser.plan;
        token.isVerified = dbUser.isVerified;
      }

      return token;
    },

    // Dodajemy dodatkowe dane użytkownika do sesji
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
        session.user.isVerified = token.isVerified as boolean;
      }

      return session;
    },

    // Tworzymy użytkownika, jeśli nie istnieje
    async signIn({ user }) {
      if (!user || !user.email) return false;

      try {
        await connectToDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name ?? "",
            image: user.image ?? "",
            role: "user", // domyślna rola
            plan: "free", // domyślny plan
            isVerified: true, // możesz ustawić false jeśli chcesz dodatkowej weryfikacji
          });
          console.log(`[NextAuth] Utworzono nowego użytkownika: ${user.email}`);
        } else {
          console.log(`[NextAuth] Użytkownik już istnieje: ${user.email}`);
        }

        return true;
      } catch (error) {
        console.error("[NextAuth] Błąd podczas tworzenia użytkownika:", error);
        return false;
      }
    },
  },
};
