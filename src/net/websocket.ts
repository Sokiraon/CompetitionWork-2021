import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import store from "../data/store";

class MySocket {
  private static instance: MySocket;

  private serverUrl = "http://159.75.220.54:5000";
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  static getInstance() {
    this.instance ?? new MySocket();
  }

  constructor() {
    this.socket = io(this.serverUrl);
    this.socket.on("update_task_status", (data) => {
      store.dispatch({
        type: "tasks/updateTaskStatus",
        payload: data.payload,
      });
    });
  }
}

export default MySocket;
