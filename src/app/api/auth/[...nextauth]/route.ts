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

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('Authorization Attempt:', {
          inputEmail: credentials?.email,
          inputEmailType: typeof credentials?.email,
          expectedEmail: process.env.ADMIN_EMAIL,
          expectedEmailType: typeof process.env.ADMIN_EMAIL,
          
          inputPasswordProvided: !!credentials?.password,
          expectedPasswordProvided: !!process.env.ADMIN_PASSWORD
        });

        const trimmedInputEmail = credentials?.email?.trim();
        const trimmedInputPassword = credentials?.password?.trim();
        const trimmedAdminEmail = process.env.ADMIN_EMAIL?.trim();
        const trimmedAdminPassword = process.env.ADMIN_PASSWORD?.trim();

        if (
          trimmedInputEmail === trimmedAdminEmail &&
          trimmedInputPassword === trimmedAdminPassword
        ) {
          console.log('Authentication Successful');
          return {
            id: "1",
            email: trimmedAdminEmail,
            name: "Admin User",
          };
        }

        console.log('Authentication Failed');
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error
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
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
});

export { handler as GET, handler as POST };