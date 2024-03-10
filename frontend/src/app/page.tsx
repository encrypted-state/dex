import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        <Button className="mt-6 px-6 py-4 text-lg rounded-lg hover:bg-pink-400 hover:text-white transition-colors duration-300 ease-in-out">
          Launch App
        </Button>
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
