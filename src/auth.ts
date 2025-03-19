import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/loginShema";
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

        const usuario = await prisma.usuario.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!usuario || !usuario.password) {
          throw new Error("Credenciales invalida");
        }

        const isValidPassword = (await data.password) === usuario.password;

        if (!isValidPassword) {
          throw new Error("Credenciales invalidas");
        }

        return usuario;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id); // Aseguramos que el id sea un número
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.id); // Convertimos el id a number
        session.user.role = token.role;
      }
      return session;
    },
  },
});
