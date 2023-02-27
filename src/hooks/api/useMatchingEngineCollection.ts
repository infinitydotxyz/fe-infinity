import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { useNetwork } from 'wagmi';

export interface MatchingEngineStatus {
  isSynced: boolean;
  matchingEngine: {
    healthStatus: {
      status: 'healthy' | 'unhealthy';
    };
    jobsProcessing: number;
  };
  orderRelay: {
    healthStatus: {
      status: 'healthy' | 'unhealthy';
    };
    jobsProcessing: number;
  };
  executionEngine: {
    healthStatus: {
      status: 'healthy' | 'unhealthy';
    };
    jobsProcessing: number;
  };
}

export const useMatchingEngineCollection = (address: string, refreshInterval = 30_000) => {
  const { chain } = useNetwork();
  const chainId = String(chain?.id ?? 1) as ChainId;
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<MatchingEngineStatus | null>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const fetch = async (signal: { abort: boolean }) => {
    try {
      if (signal.abort) {
        return;
      }
      setIsLoading(true);
      const response = await apiGet(`/v2/collections/${chainId}:${address}/matching-engine`);
      const res = response.result as MatchingEngineStatus;
      if (signal.abort) {
        return;
      }
      setIsInitialLoadComplete(true);
      setIsLoading(false);
      setStatus(res);
    } catch (err) {
      console.error(err);
      if (signal.abort) {
        return;
      }
      setIsInitialLoadComplete(true);
      setIsLoading(false);
      setStatus(null);
    }
  };

  useEffect(() => {
    const signal = { abort: false };
    fetch(signal).catch((err) => {
      console.error(err);
    });

    const interval = setInterval(() => {
      fetch(signal).catch((err) => {
        console.error(err);
      });
    }, refreshInterval);

    return () => {
      signal.abort = true;
      clearInterval(interval);
    };
  }, []);

  return {
    result: status,
    isLoading: isLoading,
    isInitialLoadComplete
  };
};
