import Link from "next/link";
import { Button } from "./components/ui/button";
import { FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-36 pb-10">
      <h1
        className="text-6xl mb-2 font-bold text-center"
        style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
      >
        End-To-End Encrypted Swaps
      </h1>
      <Link href="/swap">
        <button className="mt-6 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Launch App
          </span>
        </button>
      </Link>
      <div className="w-full max-w-4xl mt-32 sm:mt-52 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center">
          <FaCheckCircle className="h-3 w-3 mr-2" />
          <span className="text-sm">Encrypted reserves</span>
        </div>
        <div className="flex items-center justify-center">
          <FaCheckCircle className="h-3 w-3 mr-2" />
          <span className="text-sm">Encrypted transfers</span>
        </div>
        <div className="flex items-center justify-center">
          <FaCheckCircle className="h-3 w-3 mr-2" />
          <span className="text-sm">MEV resistant</span>
        </div>
      </div>
    </div>
  );
}
