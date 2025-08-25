import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

//###########################################################################################

//Stary kod

// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// // import EmailProvider from "next-auth/providers/email";
// import User from "@/models/user";
// import { connectToDB } from "@/utils/mongo/database";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/utils/mongo/mongoDbClient";
// // import nodemailer from "nodemailer";

// const THIRTY_DAYS = 30 * 24 * 60 * 60;
// const THIRTY_MINUTES = 30 * 60;

// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     // EmailProvider({
//     //   name: "email",
//     //   server: {
//     //     host: process.env.EMAIL_SERVER_HOST,
//     //     port: 465,
//     //     auth: {
//     //       user: process.env.EMAIL_SERVER_USER,
//     //       pass: process.env.EMAIL_SERVER_PASSWORD,
//     //     },
//     //   },
//     //   from: process.env.EMAIL_FROM,
//     //   async sendVerificationRequest({
//     //     identifier: email,
//     //     url,
//     //     provider: { server, from },
//     //   }) {
//     //     // console.log("send");
//     //     const { host } = new URL(url);
//     //     const transport = nodemailer.createTransport(server);
//     //     await transport.sendMail({
//     //       to: email,
//     //       from,
//     //       subject: `Twój link weryfikacyjny do LushLash`,
//     //       text: text({ url, host }),
//     //       html: html({ url, host, email }),
//     //     });
//     //   },
//     // }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   session: {
//     strategy: "jwt",
//     maxAge: THIRTY_DAYS,
//     updateAge: THIRTY_MINUTES,
//   },
//   secret: process.env.NEXTAUTH_SECRET,

//   pages: {
//     verifyRequest: "/verify-request",
//     // signIn: "/kalendarz",
//   },
//   callbacks: {
//     // async jwt({ token, account, user }) {
//     //   if (account) {
//     //     token.accessToken = account.access_token;
//     //   }
//     //   return token;
//     // },
//     // async session({ session, token }) {
//     //   session.accessToken = token.accessToken;
//     //   return session;
//     // },
//     // async session({ session, token, user }) {
//     async session({ session, token }) {
//       // store the user id from MongoDB to session
//       if (token && token.email && session && session.user) {
//         session.user.id = token.id as string;
//         session.user.plan = token.plan as string;
//         session.user.role = token.role as string;
//         session.user.isVerified = token.isVerified as boolean;
//       }

//       return session;
//     },
//     // async jwt({ token, account, user }) {
//     async jwt({ token }) {
//       if (token) {
//         await connectToDB();
//         const sessionUser = await User.findOne({ email: token.email });
//         token.role = sessionUser.role;
//         token.id = sessionUser._id.toString();
//         token.plan = sessionUser.plan;
//         token.isVerified = sessionUser.isVerified;
//       }

//       return token;
//     },
//     async signIn({ user }) {
//       // console.log('user',user)
//       if (!user || !user.email) return false;

//       try {
//         await connectToDB();

//         // check if user already exists
//         const userExists = await User.findOne({ email: user.email });

//         // if not, create a new document and save user in MongoDB
//         if (!userExists) {
//           // console.log("creating new user", user);
//           await User.create({
//             email: user.email,
//             // username: profile.name.replace(" ", "").toLowerCase(),
//             // image: profile?.picture ?? null,
//           });
//         }
//         console.log("User created");

//         return true;
//       } catch (error) {
//         console.log("Error checking if user exists: ", error);
//         return false;
//       }
//     },
//   },
// };

// // function html({ url, host, email }) {
// //   const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
// //   const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;
// //   // Your email template here new
// //   return `
// //         <body>
// //           <p>Cześć, </p>
// //           <p>Aby dokończyć logowanie kliknij w poniższy link:</p>
// //           <p></p>
// //             <a href="${url}">Zaloguj się do ${escapedHost}</a>
// //             <p>dziękuję</p>
// //             <p>LushLash by Agata</p>
// //         </body>
// //     `;
// // }

// // Fallback for non-HTML email clients
// // function text({ url, host }) {
// //   return `Zaloguj się do ${host}\n${url}\n\n`;
// // }

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
