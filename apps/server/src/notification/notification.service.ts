import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BidEvents } from 'src/bid/events/bid-events';

@Injectable()
export class NotificationService {
  @OnEvent(BidEvents.AUTO_BID_REACHED)
  autobidReached() {
    console.log('Autobid reached');
  }

  @OnEvent(BidEvents.AUTO_BID_EXCEDDED)
  autobidExceeded() {
    console.log('Autobid exceeded');
  }
}
