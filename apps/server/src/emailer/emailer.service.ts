import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './email.interface';
import Mail from 'nodemailer/lib/mailer';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ItemEvents } from 'src/item/events/item-events';
import { BidEvents } from 'src/bid/events/bid-events';
import { Bid } from 'src/bid/schema/bid.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BiddingHistory } from 'src/bid/schema/bid-history.schema';
import { Model } from 'mongoose';
import { BillingEvents } from 'src/billing/events/billing.events';
import { CreateBiddingDto } from 'src/bidding/dto/create-bidding.dto';

// ! TODO: Implement Real Email!!

@Injectable()
export class EmailerService {
  constructor(
    @InjectModel(BiddingHistory.name)
    private readonly biddingHistoryModel: Model<BiddingHistory>,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(ItemEvents.ITEM_AWARDED, { async: true })
  async onItemAwarded(highestBid: Bid) {
    if (highestBid) {
      const usersBiddingOnItem = await this.getUsersBiddingOnItem(
        highestBid.item._id.toString(),
      );

      for (const user of usersBiddingOnItem) {
        if (user.user._id.toString() === highestBid.user._id.toString()) {
          this.eventEmitter.emit(BillingEvents.CREATE, {
            amountDue: highestBid.bidAmount,
            biddingHistory: user,
          });
          console.log('Send congratulatory email to: ', user.user.username);
        } else {
          console.log(
            `Send email to ${user.user.username} saying the bidding for this item has been closed`,
          );
        }
      }
    }
    return;

    // const dto: SendEmailDto = {
    //   receipients: [
    //     {
    //       name: 'Tirivashe Shamhu',
    //       address: 'shaymusts@gmail.com',
    //     },
    //   ],
    //   subject: 'Tiri - Item Awarded',
    //   html: '<p>Congratulations on winning the item!</p><p>Thank you for using Tiri</p>',
    // };
    // const res = await this.sendEmail(dto);
    // console.log('Email sent!!!!');
    // return res;
  }

  @OnEvent(BidEvents.CREATED, { async: true })
  async onBidCreatedOnItem(createBiddingDto: CreateBiddingDto) {
    const usersBiddingOnItem = await this.getUsersBiddingOnItem(
      createBiddingDto.itemId,
    );
    for (const user of usersBiddingOnItem) {
      if (user.user._id.toString() === createBiddingDto.userId) continue;
      console.log(
        'Send email to:',
        user.user.username,
        ' to notify them of the new bid',
      );
    }
    // const dto: SendEmailDto = {
    //   receipients: [
    //     {
    //       name: 'Tirivashe Shamhu',
    //       address: 'shaymusts@gmail.com',
    //     },
    //   ],
    //   subject: 'Tiri - Bid Created',
    //   html: '<p>Bid created</p><p>Thank you for using Tiri</p>',
    // };
    // await this.sendEmail(dto);
  }

  @OnEvent(BidEvents.AUTO_BID_REACHED)
  onAutoBidAmountReached() {}

  @OnEvent(BidEvents.AUTO_BID_EXCEDDED)
  onAutoBidAmountExceeded() {}
  private emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });

    return transporter;
  }

  private async sendEmail(dto: SendEmailDto) {
    const { receipients, subject, from, html, text } = dto;
    const transporter = this.emailTransport();
    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to: receipients,
      subject,
      html,
      text,
    };
    try {
      const res = await transporter.sendMail(options);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  }

  private async getUsersBiddingOnItem(
    itemId: string,
  ): Promise<BiddingHistory[]> {
    return await this.biddingHistoryModel
      .find({
        item: itemId,
      })
      .populate('user');
  }
}
