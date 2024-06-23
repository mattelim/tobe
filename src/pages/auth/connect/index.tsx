import { useRouter } from "next/router";
import { useEffect } from "react";

import { Card } from "@/components/ui/card";

export default function CredConnect() {
  const router = useRouter();
  const url = router.query;

  async function fetchConnect(url: any) {
    const response = await fetch("/api/credconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: url?.code,
        scope: url?.scope,
      }),
    });

    if (response.status === 200) {
      setTimeout(() => {
        router.push("/");
      }, 500);
    }
    if (!response.ok) {
      return;
    }
  }

  useEffect(() => {
    fetchConnect(url);
  }, [url]);

  return (
    <main className="h-screen flex justify-center items-center">
      <Card className="p-4 animate-pulse">Connecting...</Card>
    </main>
  );
}
