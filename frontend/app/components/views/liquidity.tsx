"use client"

import LiquidityProvision from "../liquidity-provision";
import { useRouter } from 'next/navigation';

// components/views/liquidity.tsx

const Liquidity = () => {
  const router = useRouter();

  return (
    <>
    <button 
        onClick={() => router.push('/liquidity')}
        className="mb-4"
      >
        ← Back to Pools
      </button>
      <h1 className="font-semibold text-2xl mb-2 text-center">Liquidity Management</h1>
      <LiquidityProvision />
    </>
  );
};
export default Liquidity;
