import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "./api/auth/[...nextauth]/auth";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat app",
  description: "A MERN stack chat app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        {session && (
          <div className="flex items-center justify-between p-2 bg-slate-200 border-b border-b-slate-400">
            <Link href="/api/auth/signout">
              <Button>Sign Out</Button>
            </Link>
            <span className="font-bold text-end text-slate-600">
              {session.user?.email}
              <br />({session.user?.name})
            </span>
          </div>
        )}
        <div className="m-6">{children}</div>
      </body>
    </html>
  );
}
