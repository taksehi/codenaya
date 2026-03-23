"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export const UnauthenticatedView = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#07070a]">
      <Spinner className="size-6 text-indigo-400" />
    </div>
  );
};