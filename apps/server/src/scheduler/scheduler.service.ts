import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { BidEvents } from 'src/bid/events/bid-events';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';
import { ItemEvents } from 'src/item/events/item-events';
import { Item } from 'src/item/schema/item.schema';

const EXECUTION_DELAY = 1;

@Injectable()
export class SchedulerService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(ItemEvents.CREATED)
  onItemCreated(item: Item) {
    const timeoutDuration =
      dayjs(item.expiresAt).valueOf() - Date.now() + EXECUTION_DELAY;
    this.addTimeout(item._id.toString(), timeoutDuration);
  }
  @OnEvent(ItemEvents.UPDATED)
  onItemUpdated({
    id,
    updateItemDto,
  }: {
    id: string;
    updateItemDto: UpdateItemDto;
  }) {
    if (!updateItemDto.expiresAt) return;
    this.schedulerRegistry.deleteTimeout(id);
    const timeoutDuration =
      dayjs(updateItemDto.expiresAt).valueOf() - Date.now() + EXECUTION_DELAY;
    this.addTimeout(id, timeoutDuration);
  }

  @OnEvent(ItemEvents.DELETED)
  onItemDeleted(id: string) {
    this.schedulerRegistry.deleteTimeout(id);
  }

  private addTimeout(id: string, milliseconds: number) {
    const callback = () => {
      this.eventEmitter.emit(BidEvents.CLOSED, id);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(id, timeout);
  }
}
