import NavBar from "@/components/NavBar";
import React from "react";
import Head from "next/head";

export default function Layout1({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>YourTube</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="w-screen h-screen flex overflow-clip">
        <NavBar />
        {children}
      </main>
    </>
  );
}
