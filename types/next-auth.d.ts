import { DefaultUser } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      plan: string;
      role: string;
      isVerified: boolean;
    };
    accessToken: string;
  }
  interface User extends DefaultUser {
    plan: string;
    stripeCustomerId: string;
    role: string;
    isVerified: boolean;
  }
}