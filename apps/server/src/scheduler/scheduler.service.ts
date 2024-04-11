import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import * as dayjs from 'dayjs';

const EXECUTION_DELAY = 1;

@Injectable()
export class SchedulerService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  @OnEvent('item.created')
  onItemCreated(data: CreateItemDto) {
    const timeout =
      dayjs(data.expiresAt).valueOf() - Date.now() + EXECUTION_DELAY;
    this.addTimeout(data.name, timeout);
  }

  private addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      console.log(`Timeout ${name} executing after (${milliseconds})!`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }
}
