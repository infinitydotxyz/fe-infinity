/* eslint-disable eqeqeq */
import { ExecutionStatus } from '@infinityxyz/lib-frontend/types/core';
import { MatchingEngineStatus } from 'src/hooks/api/useMatchingEngineCollection';
import { nFormatter } from 'src/utils';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export const MatchingEngineStatusIcon = ({
  matchingEngineStatus,
  component
}: {
  matchingEngineStatus: MatchingEngineStatus | null;
  component: 'matchingEngine' | 'orderRelay' | 'executionEngine';
}) => {
  if (!matchingEngineStatus) {
    return <StatusIcon status="invalid" label={'Inactive'} />;
  }

  if (matchingEngineStatus[component].healthStatus.status === 'healthy') {
    if (matchingEngineStatus[component].jobsProcessing < 100) {
      return (
        <StatusIcon
          status="complete"
          label={`Live`}
          duration={component !== 'orderRelay' ? matchingEngineStatus.averages[component].collectionAverage : null}
        />
      );
    }
    return (
      <StatusIcon
        status="pending"
        label={`Syncing ${nFormatter(matchingEngineStatus[component].jobsProcessing, 2)} orders`}
      />
    );
  } else {
    return <StatusIcon status="invalid" label={'Inactive'} />;
  }
};

export const OrderMatchStatusIcon = ({ executionStatus }: { executionStatus: ExecutionStatus | null }) => {
  if (!executionStatus) {
    return <StatusIcon status="invalid" label={'Disabled'} />;
  }

  switch (executionStatus.status) {
    case 'not-found': {
      return <StatusIcon status="pending" label={'Queued'} />;
    }
    case 'pending-matching': {
      return <StatusIcon status="pending" label={'Queued'} />;
    }
    case 'matched-no-matches': {
      return <StatusIcon status="pending-indefinite" label={'No matches'} />;
    }
    case 'matched-pending-execution':
    case 'matched-inexecutable':
    case 'matched-inexecutable-offer-weth-too-low':
    case 'matched-inexecutable-offer-weth-allowance-too-low':
    case 'matched-executing':
    case 'matched-executing-not-included':
    case 'matched-executed': {
      const duration = executionStatus.matchInfo.matchedAt - executionStatus.matchInfo.proposerInitiatedAt;
      return <StatusIcon status="complete" label={'Matched'} duration={duration} />;
    }
    default: {
      return <StatusIcon status="pending-indefinite" label={'Pending'} />;
    }
  }
};

export const OrderExecutionStatusIcon = ({
  executionStatus,
  isSellOrder
}: {
  executionStatus: ExecutionStatus | null;
  isSellOrder: boolean;
}) => {
  if (!executionStatus) {
    return <StatusIcon status="invalid" label={'Disabled'} />;
  }

  switch (executionStatus.status) {
    case 'not-found': {
      return <StatusIcon status="invalid" label={'Invalid'} />;
    }
    case 'pending-matching': {
      return <StatusIcon status="invalid" label={'Requires match'} />;
    }
    case 'matched-no-matches': {
      return <StatusIcon status="invalid" label={'Requires match'} />;
    }
    case 'matched-pending-execution': {
      switch (executionStatus.reason) {
        case 'gas-too-low': {
          return (
            <StatusIcon
              status="pending-indefinite"
              label={`Gas too low. ${nFormatter(parseFloat(executionStatus.bestMatchMaxFeePerGasGwei), 0)} GWEI`}
            />
          );
        }
        case 'unknown': {
          return <StatusIcon status="pending-indefinite" label={'Queued'} />;
        }
        default: {
          return <StatusIcon status="pending-indefinite" label={'Queued'} />;
        }
      }
    }

    case 'matched-inexecutable-offer-weth-too-low': {
      if (isSellOrder) {
        return <StatusIcon status="invalid" label={'Requires match'} />;
      }
      return <StatusIcon status="pending-indefinite" label={'WETH balance too low'} />;
    }

    case 'matched-inexecutable-offer-weth-allowance-too-low': {
      if (isSellOrder) {
        return <StatusIcon status="invalid" label={'Requires match'} />;
      }
      return <StatusIcon status="pending-indefinite" label={'WETH allowance too low'} />;
    }

    case 'matched-inexecutable': {
      return <StatusIcon status="pending-indefinite" label={'Inexecutable'} />;
    }
    case 'matched-executing': {
      return <StatusIcon status="pending" label={'Executing'} />;
    }
    case 'matched-executing-not-included': {
      return <StatusIcon status="pending" label={'Executing'} />;
    }
    case 'matched-executed': {
      const duration = executionStatus.executionInfo.blockTimestampSeconds * 1000 - executionStatus.matchInfo.matchedAt;
      return <StatusIcon status="complete" label={'Executed'} duration={duration} />;
    }
    default: {
      return <StatusIcon status="pending-indefinite" label={'Pending'} />;
    }
  }
};

export const MatchAndExecutionOrderStatus = ({
  executionStatus,
  isSellOrder
}: {
  executionStatus: ExecutionStatus | null;
  isSellOrder: boolean;
}) => {
  if (!executionStatus) {
    return <StatusIcon status="invalid" label={'Disabled'} />;
  }

  switch (executionStatus.status) {
    case 'not-found': {
      return <StatusIcon status="pending" label={'Matching'} />;
    }
    case 'pending-matching': {
      return <StatusIcon status="pending" label={'Matching'} />;
    }
    case 'matched-no-matches': {
      return <StatusIcon status="pending-indefinite" label={'No matches'} />;
    }
    case 'matched-pending-execution': {
      switch (executionStatus.reason) {
        case 'gas-too-low': {
          return (
            <StatusIcon
              status="pending-indefinite"
              label={`Gas too low. ${nFormatter(parseFloat(executionStatus.bestMatchMaxFeePerGasGwei), 0)} GWEI`}
            />
          );
        }
        case 'unknown': {
          return <StatusIcon status="pending-indefinite" label={'Queued'} />;
        }
        default: {
          return <StatusIcon status="pending-indefinite" label={'Queued'} />;
        }
      }
    }
    case 'matched-inexecutable-offer-weth-too-low': {
      if (isSellOrder) {
        return <StatusIcon status="pending-indefinite" label={'No matches'} />;
      }
      return <StatusIcon status="pending-indefinite" label={'WETH balance too low'} />;
    }

    case 'matched-inexecutable-offer-weth-allowance-too-low': {
      if (isSellOrder) {
        return <StatusIcon status="invalid" label={'Requires match'} />;
      }
      return <StatusIcon status="pending-indefinite" label={'WETH allowance too low'} />;
    }
    case 'matched-inexecutable': {
      return <StatusIcon status="pending-indefinite" label={'Inexecutable'} />;
    }
    case 'matched-executing': {
      return <StatusIcon status="pending" label={'Executing'} />;
    }
    case 'matched-executing-not-included': {
      return <StatusIcon status="pending" label={'Executing'} />;
    }
    case 'matched-executed': {
      const duration = executionStatus.executionInfo.blockTimestampSeconds * 1000 - executionStatus.matchInfo.matchedAt;
      return <StatusIcon status="complete" label={'Executed'} duration={duration} />;
    }
    default: {
      return <StatusIcon status="pending-indefinite" label={'Pending'} />;
    }
  }
};

export const StatusIcon = ({
  status,
  label,
  duration,
  iconClassName
}: {
  status: 'complete' | 'pending' | 'pending-indefinite' | 'error' | 'invalid';
  label: string;
  duration?: number | null;
  iconClassName?: string;
}) => {
  let iconClass = '';
  switch (status) {
    case 'complete':
      iconClass = 'bg-green-500';
      break;
    case 'pending':
      iconClass = 'bg-blue-500';
      break;
    case 'pending-indefinite':
      iconClass = 'bg-blue-800';
      break;
    case 'error':
      iconClass = 'bg-red-500';
      break;

    case 'invalid':
      iconClass = 'bg-gray-500';
      break;
    default:
      iconClass = 'bg-gray-500';
      break;
  }

  const formatDuration = (_duration: number) => {
    const duration = Math.abs(_duration);
    if (duration < 1000) {
      return `${(duration / 1000).toFixed(2)}s`;
    }
    if (duration < 60000) {
      return `${(duration / 1000).toFixed(2)}s`;
    }
    if (duration < 3600000) {
      return `${(duration / 60000).toFixed(2)}mins`;
    }
    return `${(duration / 3600000).toFixed(2)}hrs`;
  };

  const isValid = status != 'invalid';

  return (
    <div className="flex items-center h-max px-2.5 py-1.75 border rounded-4 dark:border-neutral-200 border-gray-300 space-x-1.5">
      <span className="text-base leading-5 font-semibold">
        {label}
        {duration != null && (
          <span className={twMerge(secondaryTextColor, 'text-xs font-medium')}>({formatDuration(duration)})</span>
        )}
      </span>
      <span className={twMerge('flex w-2 h-2 relative', iconClassName)}>
        <span
          className={`${isValid ? 'animate-ping' : ''} absolute w-full h-full rounded-full ${iconClass} opacity-75`}
        ></span>
        <span className={`rounded-full w-full ${iconClass}`}></span>
      </span>
    </div>
  );
};
