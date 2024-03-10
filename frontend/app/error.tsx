"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);



  return (
    <div className="w-screen text-center">
      <div className="my-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <h4 className="text-lg">{error.message}</h4>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
