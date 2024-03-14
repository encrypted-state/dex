import React from 'react';
import { dummyPools, Pool } from '../dummyData';
import Liquidity from "../../components/views/liquidity";

export const generateStaticParams = async () => {
  return dummyPools.map((pool) => ({
    contractAddress: pool.contractAddress,
  }));
};

export const generateMetadata = async ({ params }: { params: { contractAddress: string } }) => {
  const { contractAddress } = params;
  const poolDetails = dummyPools.find((pool) => pool.contractAddress === contractAddress);

  if (!poolDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      poolDetails,
    },
  };
};

type Props = {
  params: { contractAddress: string };
  poolDetails: Pool;
};

const PoolDetailsPage: React.FC<Props> = ({ poolDetails }) => {
  return <Liquidity />;
};

export default PoolDetailsPage;