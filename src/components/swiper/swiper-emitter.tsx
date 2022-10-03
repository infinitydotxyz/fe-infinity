import { Direction } from './swiper-card';
import mitt from 'mitt';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core/Token';

export type SwiperEvent = {
  dir: Direction;
  index: number;
};

type SwiperType = {
  swipe: SwiperEvent;
};

export type SwiperLikeEvent = {
  tokenId: string;
  liked: boolean;
  nft: Erc721Token;
};

type SwiperLikeType = {
  swipeLike: SwiperLikeEvent;
};

export class SwiperEmitter {
  private emitter = mitt<SwiperType>();
  private emitter2 = mitt<SwiperLikeType>();

  emitSwipe(event: SwiperEvent) {
    this.emitter.emit('swipe', event);
  }

  onSwipe(listener: (data: SwiperEvent) => void): void {
    this.emitter.on('swipe', listener);
  }

  removeSwipe(listener: (data: SwiperEvent) => void): void {
    this.emitter.off('swipe', listener);
  }

  // --------------------------------------------------------

  emitSwipeLike(event: SwiperLikeEvent) {
    this.emitter2.emit('swipeLike', event);
  }

  onSwipeLike(listener: (data: SwiperLikeEvent) => void): void {
    this.emitter2.on('swipeLike', listener);
  }

  removeSwipeLike(listener: (data: SwiperLikeEvent) => void): void {
    this.emitter2.off('swipeLike', listener);
  }
}
