import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

class WebSocketService {
  private stompClient: Client | null = null;

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stompClient && this.stompClient.connected) {
        resolve();
        return;
      }

      const socket = new SockJS('http://localhost:8080/chat-websocket');
      
      socket.onclose = () => {
        reject(new Error('SockJS connection closed'));
      };

      socket.onerror = (error) => {
        reject(new Error(`SockJS connection error: ${error}`));
      };

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        reject(new Error('WebSocket connection error'));
      };

      this.stompClient.activate();

      setTimeout(() => {
        if (!this.stompClient?.connected) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 5000);
    });
  }

  public reconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stompClient) {
        this.stompClient.deactivate();
      }
      this.connect()
        .then(resolve)
        .catch(reject);
    });
  }

  public isConnected(): boolean {
    return !!this.stompClient && this.stompClient.connected;
  }

  public isConnecting(): boolean {
    return !!this.stompClient && this.stompClient.active && !this.stompClient.connected;
  }

  public subscribe(destination: string, callback: (message: IMessage) => void): void {
    if (this.isConnected()) {
      this.stompClient!.subscribe(destination, callback);
    } else {
      console.error('STOMP client is not connected');
    }
  }

  public sendMessage(destination: string, body: any): void {
    if (this.isConnected()) {
      this.stompClient!.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('STOMP client is not connected');
    }
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}

export default new WebSocketService();