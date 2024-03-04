import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

// It is chat related
@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('private message')
  handleAdminMessage(client: Socket, payload: any): void {
    const receiverSocketId = payload.receiverSocketId;
    this.server
      .to(receiverSocketId)
      .emit('private message', client.id, payload);
  }

  users = [];

  addUser = (userId, socketId) => {
    return (
      !this.users.some((item) => item.socketId === socketId) &&
      this.users.push({ userId, socketId })
    );
  };

  getUser = (userId) => {
    return this.users.find((user) => user.userId === userId);
  };

  removeUser = (socketId) => {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  };

  @SubscribeMessage('clicklog')
  handleTrafficData(client: Socket, payload: any): any {
    this.users.filter((item) => {
      if (item.userId === payload.userId) {
        this.server.to(item.socketId).emit('upcomingLog', payload);
      }
    });
  }

  @SubscribeMessage('adduser')
  handleAddUser(client: Socket, payload: any): any {
    this.addUser(payload.userId, client.id);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.removeUser(client.id);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
