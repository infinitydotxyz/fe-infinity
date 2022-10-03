import { Direction } from './tinder-card';
import mitt from 'mitt';

export type SwiperEvent = {
  dir: Direction;
  index: number;
};

type SwiperType = {
  swipe: SwiperEvent;
};

export class TinderSwiperEmitter {
  private emitter = mitt<SwiperType>();

  emitSwipe(event: SwiperEvent) {
    this.emitter.emit('swipe', event);
  }

  onSwipe(listener: (data: SwiperEvent) => void): void {
    this.emitter.on('swipe', listener);
  }

  removeSwipe(listener: (data: SwiperEvent) => void): void {
    this.emitter.off('swipe', listener);
  }
}
