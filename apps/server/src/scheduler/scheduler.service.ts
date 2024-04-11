import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SchedulerService {
  @OnEvent('item.created')
  onItemCreated() {
    console.log('Item created');
  }
}
