import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/loginShema";
// import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            username: data.usuario,
          },
        });

        if (!user || !user.password) {
          throw new Error("Credenciales invalidas");
        }

        const isValidPassword = (await data.contrasena) === user.password;
        //const isValidPassword = await bcrypt.compare(data.contrasena, user.password);

        if (!isValidPassword) {
          throw new Error("Credenciales invalidas");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});
