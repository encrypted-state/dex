
// liquidity/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import PoolCard from '../components/pool-card';
import { dummyPools, Pool } from './dummyData';

const LiquidityPage = () => {
  const [pools, setPools] = useState<Pool[]>([]);

  useEffect(() => {
    setPools(dummyPools);
  }, []);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-2 mt-8 text-left">Liquidity Pools</h1>
      <h3 className="font-semibold text-xl mb-10 text-left">Epoch ends in 3.43 hrs</h3>
      {pools.map((pool) => (
        <PoolCard key={pool.contractAddress} pool={pool} />
      ))}
    </div>
  );
};

export default LiquidityPage;