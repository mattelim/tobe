import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Unplug } from "lucide-react";

interface Test {
  name?: string;
}

export default function AuthPage() {
  const [test, setTest] = useState<Test>({});

  async function fetchAuth() {
    const response = await fetch("/api/auth");
    const data = await response.json();
    setTest(data);
  }

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <main className="h-screen flex items-center justify-center">
      <a href={test.name}>
        <Button className="gap-2">
          <Unplug />
          Connect to YouTube
        </Button>
      </a>
    </main>
  );
}
