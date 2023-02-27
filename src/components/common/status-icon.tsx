/* eslint-disable eqeqeq */
import { ExecutionStatus } from '@infinityxyz/lib-frontend/types/core';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

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
    case 'matched-executing':
    case 'matched-executing-not-included':
    case 'matched-executed': {
      const duration = executionStatus.matchInfo.matchedAt - executionStatus.matchInfo.proposerInitiatedAt;
      return <StatusIcon status="complete" label={'Matched'} duration={duration} />;
    }
  }
};

export const OrderExecutionStatusIcon = ({ executionStatus }: { executionStatus: ExecutionStatus | null }) => {
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
      return <StatusIcon status="pending-indefinite" label={'Queued'} />;
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
  }
};

export const MatchAndExecutionOrderStatus = ({ executionStatus }: { executionStatus: ExecutionStatus | null }) => {
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
      return <StatusIcon status="pending-indefinite" label={'Executing'} />;
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
  }
};

export const StatusIcon = ({
  status,
  label,
  duration
}: {
  status: 'complete' | 'pending' | 'pending-indefinite' | 'error' | 'invalid';
  label: string;
  duration?: number;
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

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`;
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
    <div className="flex items-center space-x-2">
      <span className="flex w-2.5 h-2.5 relative">
        <span
          className={`${isValid ? 'animate-ping' : ''} absolute w-full h-full rounded-full ${iconClass} opacity-75`}
        ></span>
        <span className={`rounded-full w-full ${iconClass}`}></span>
      </span>
      <span className="ml-2">
        {label}{' '}
        {duration != null && (
          <span className={twMerge(secondaryTextColor, 'text-xs font-medium')}>({formatDuration(duration)})</span>
        )}
      </span>
    </div>
  );
};
