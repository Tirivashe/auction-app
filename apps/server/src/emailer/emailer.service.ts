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
import { Status } from 'src/types';

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
          this.sendCongratsEmail(user, highestBid);
        } else {
          this.sendBidClosedEmail(user, highestBid);
        }
      }
    }
    return;
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
      const dto: SendEmailDto = {
        receipients: [
          {
            name: user.user.username,
            address: user.user.email,
          },
        ],
        subject: `${user.user.username} - Bid Created`,
        html: `<p>Bid created on item ${createBiddingDto.itemId}</p>`,
      };
      await this.sendEmail(dto);
    }
  }

  @OnEvent(BidEvents.AUTO_BID_REACHED)
  onAutoBidAmountReached(user: BiddingHistory) {
    this.sendAutoBidPercentageReachedEmail(user);
  }

  @OnEvent(BidEvents.AUTO_BID_EXCEEDED)
  onAutoBidAmountExceeded(history: BiddingHistory) {
    this.sendAutoBidAmountExceededEmail(history);
  }
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
      .populate('user')
      .populate('item');
  }

  private sendCongratsEmail(history: BiddingHistory, highestBid: Bid) {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
        </head>
        <body style=3D"font-family: sans-serif;">
          <div style=3D"display: block; margin: auto; max-width: 600px;" class=3D"main">
            <h3 style=3D"font-size: 18px; font-weight: bold; margin-top: 20px">Congrats ${history.user.username}!</h3>
            <p>You have won the ${highestBid.item.name}! You have won it for $${highestBid.bidAmount}</p>
            <p>Good luck on you next bid and thank you for choosing us for auctioning.</p>
          </div>
        </body>
      </html>`;
    const dto: SendEmailDto = {
      receipients: [
        {
          name: history.user.username,
          address: history.user.email,
        },
      ],
      subject: 'Congratulations!',
      html,
    };
    this.sendEmail(dto);
  }
  private sendBidClosedEmail(history: BiddingHistory, highestBid: Bid) {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
        </head>
        <body style=3D"font-family: sans-serif;">
          <div style=3D"display: block; margin: auto; max-width: 600px;" class=3D"main">
            <h3 style=3D"font-size: 18px; font-weight: bold; margin-top: 20px">Hello ${history.user.username}!</h3>
            <p>Bidding for the ${highestBid.item.name} has closed!</p>
            <p>Thank you for choosing us for auctioning.</p>
          </div>
        </body>
      </html>`;
    const dto: SendEmailDto = {
      receipients: [
        {
          name: history.user.username,
          address: history.user.email,
        },
      ],
      subject: 'Bidding for item closed!',
      html,
    };
    this.sendEmail(dto);
  }
  private sendAutoBidPercentageReachedEmail(history: BiddingHistory) {
    // eslint-disable-next-line prettier/prettier
    const bidStatus =
      history.bidStatus === Status.InProgress
        ? 'in progress'
        : Status.Won
          ? 'won'
          : 'lost';
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
        </head>
        <body style=3D"font-family: sans-serif;">
          <div style=3D"display: block; margin: auto; max-width: 600px;" class=3D"main">
            <h3 style=3D"font-size: 18px; font-weight: bold; margin-top: 20px">Hello ${history.user.username}!</h3>
            <p>Bidding for the ${history.item.name} has reached your set notification threshold. Currently the item bid has been ${bidStatus}</p>
            <p>Thank you for choosing us for auctioning.</p>
          </div>
        </body>
      </html>`;
    const dto: SendEmailDto = {
      receipients: [
        {
          name: history.user.username,
          address: history.user.email,
        },
      ],
      subject: 'Auto bid amount threshold reached!',
      html,
    };
    this.sendEmail(dto);
  }
  private sendAutoBidAmountExceededEmail(history: BiddingHistory) {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
        </head>
        <body style=3D"font-family: sans-serif;">
          <div style=3D"display: block; margin: auto; max-width: 600px;" class=3D"main">
            <h3 style=3D"font-size: 18px; font-weight: bold; margin-top: 20px">Hi ${history.user.username}!</h3>
            <p>This is to let you know your maximum bidding amount for ${history.item.name} has exceeded! Auto bidding has been disabled</p>
            <p>Thank you for choosing us for auctioning.</p>
          </div>
        </body>
      </html>`;
    const dto: SendEmailDto = {
      receipients: [
        {
          name: history.user.username,
          address: history.user.email,
        },
      ],
      subject: 'Maximum bid amount exceeded!',
      html,
    };
    this.sendEmail(dto);
  }
}
