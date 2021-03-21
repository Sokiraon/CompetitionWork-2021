import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

class MySocket {
  private static instance: MySocket;
  
  private serverUrl = 'http://localhost:5000';
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  static getInstance() {
    this.instance ?? new MySocket();
  }
  
  constructor() {
    this.socket = io(this.serverUrl);
    this.socket.on('success', (data) => console.log(data));
    this.socket.on('update task', (data) => console.log(data));
  }
}

export default MySocket;