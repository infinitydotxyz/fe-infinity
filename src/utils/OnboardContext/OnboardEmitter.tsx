/* eslint-disable @typescript-eslint/no-explicit-any */
import mitt from 'mitt';
import { ProviderEvents } from '../providers/AbstractProvider';

class _Emitter {
  emitter = mitt();

  emit(event: ProviderEvents, ...args: any) {
    this.emitter.emit(event, args);
  }

  on(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.on(event, listener);
  }

  removeListener(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.off(event, listener);
  }
}

// Singleton
export const OnboardEmitter = new _Emitter();
