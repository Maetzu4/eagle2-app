//@/types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: int; // Asegúrate de que el tipo sea `number`
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number; // Asegúrate de que el tipo sea `number`
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number; // Asegúrate de que el tipo sea `number`
    role?: string;
  }
}
