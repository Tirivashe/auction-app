import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { BiddingService } from './bidding.service';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BiddingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly biddingService: BiddingService) {}

  @SubscribeMessage('createBidding')
  create(@MessageBody() createBiddingDto: CreateBiddingDto) {
    return this.biddingService.create(createBiddingDto);
  }

  @SubscribeMessage('findAllBidding')
  findAll() {
    return this.biddingService.findAll();
  }

  @SubscribeMessage('findOneBidding')
  findOne(@MessageBody() id: number) {
    return this.biddingService.findOne(id);
  }

  @SubscribeMessage('updateBidding')
  update(@MessageBody() updateBiddingDto: UpdateBiddingDto) {
    return this.biddingService.update(updateBiddingDto.id, updateBiddingDto);
  }

  @SubscribeMessage('removeBidding')
  remove(@MessageBody() id: number) {
    return this.biddingService.remove(id);
  }

  @SubscribeMessage('message')
  helloFromServer(@MessageBody() message: string) {
    this.server.emit(
      'reply',
      `Hello from server. Here is your message: ${message}`,
    );
    return;
  }

  handleConnection(client: Socket) {
    this.server.emit('connected');
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
