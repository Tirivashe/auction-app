import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  @OnEvent('autobid.reached')
  autobidReached() {
    console.log('Autobid reached');
  }

  @OnEvent('autobid.exceeded')
  autobidExceeded() {
    console.log('Autobid exceeded');
  }
}
