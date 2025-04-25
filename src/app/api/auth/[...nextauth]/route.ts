// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// // import GithubProvider from "next-auth/providers/github";

// const handler = NextAuth({
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     // GithubProvider({
//     //   clientId: process.env.GITHUB_ID || "",
//     //   clientSecret: process.env.GITHUB_SECRET || "",
//     // }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (
//           credentials?.email === process.env.ADMIN_EMAIL &&
//           credentials?.password === process.env.ADMIN_PASSWORD
//         ) {
//           return {
//             id: "1",
//             email: process.env.ADMIN_EMAIL,
//             name: "Admin User",
//           };
//         }
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = "admin";
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Explicit null/undefined check
        if (!credentials) {
          return null;
        }

        // Destructure with default empty strings to prevent undefined errors
        const { email = '', password = '' } = credentials;

        // Trim inputs to remove any whitespace
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Compare with environment variables
        if (
          trimmedEmail === process.env.ADMIN_EMAIL?.trim() &&
          trimmedPassword === process.env.ADMIN_PASSWORD?.trim()
        ) {
          return {
            id: "1",
            email: trimmedEmail,
            name: "Admin User"
          };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };