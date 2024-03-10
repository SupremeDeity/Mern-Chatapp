import NextAuth from "next-auth";
import { nextauth_config } from "./auth";

const handler = NextAuth(nextauth_config);

export { handler as GET, handler as POST };
