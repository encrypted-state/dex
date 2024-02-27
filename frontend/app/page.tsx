"use client";

import { useRouter } from "next/navigation";
import Swap from "./components/views/swap";

export default function Home() {
  const router = useRouter();
  router.replace("/swap");
  return <></>;
}
