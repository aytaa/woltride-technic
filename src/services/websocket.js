class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.reconnectTimeout = null;
  }

  connect() {
    this.ws = new WebSocket('wss://ws.woltride.com');

    this.ws.onopen = () => {
      console.log('✅ Connected to WoltRide');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(callback => callback(data));
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('🔄 Reconnecting...');
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) this.ws.close();
  }
}

export default new WebSocketService();
