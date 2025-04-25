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

import NextAuth, { 
  AuthOptions
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define custom types for type safety
interface CustomUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { 
          label: "Email", 
          type: "text",
          placeholder: "your email"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        // Validate credentials
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Compare credentials with environment variables
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Return a user object if authentication is successful
          return {
            id: "1",
            email: credentials.email,
            name: "Admin User"
          };
        }

        // Return null if credentials are invalid
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Type-safe handling of user data during token creation
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      // Extend session with custom properties
      if (session.user) {
        (session.user as CustomUser).id = token.id as string;
        (session.user as CustomUser).role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };