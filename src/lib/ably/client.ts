import Ably from 'ably';
import type { 
  NotificationChannel, 
  NotificationMessage, 
  AblyClientConfig,
  AblyChannelInstance
} from './types';

export class AblyClient {
  private client: Ably.Realtime;
  private channels: Map<string, AblyChannelInstance> = new Map();

  constructor(config: AblyClientConfig) {
    this.client = new Ably.Realtime({
      authUrl: config.authUrl,
      authMethod: 'GET',
      clientId: config.clientId,
      disconnectedRetryTimeout: 15000,  // Increased to 15 seconds
      suspendedRetryTimeout: 30000,     // Increased to 30 seconds
      autoConnect: false,               // Changed to manual connect for better control
      recover: function(lastConnectionDetails, cb) {
        cb(true);
      },
      realtimeRequestTimeout: 20000,    // Increased request timeout
      httpRequestTimeout: 20000         // Increased HTTP timeout
    });

    this.client.connection.on('connected', () => {
      console.log('Connected to Ably');
    });

    this.client.connection.on('disconnected', () => {
      console.log('Disconnected from Ably, attempting to reconnect...');
    });

    this.client.connection.on('suspended', () => {
      console.warn('Connection suspended, will retry...');
    });

    this.client.connection.on('failed', () => {
      console.error('Failed to connect to Ably');
    });

    this.client.connection.on('closed', () => {
      console.log('Ably connection closed');
      // Clean up channels on connection close
      this.channels.clear();
    });
  }

  private isConnected(): boolean {
    return this.client.connection.state === 'connected';
  }

  private async ensureConnection(): Promise<void> {
    if (this.isConnected()) {
      return;
    }

    return new Promise((resolve, reject) => {
      const maxRetries = 3;
      let retryCount = 0;
      let currentTimeout: NodeJS.Timeout;

      const cleanup = () => {
        this.client.connection.off(connectedHandler);
        this.client.connection.off(failedHandler);
        this.client.connection.off(disconnectedHandler);
        this.client.connection.off(suspendedHandler);
        clearTimeout(currentTimeout);
      };

      const attemptReconnect = () => {
        if (retryCount >= maxRetries) {
          cleanup();
          reject(new Error('Failed to connect after maximum retries'));
          return;
        }

        retryCount++;
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff capped at 10s
        console.log(`Attempting to reconnect in ${backoffTime}ms (attempt ${retryCount}/${maxRetries})...`);
        
        currentTimeout = setTimeout(() => {
          if (!this.isConnected()) {
            this.client.connect();
          }
        }, backoffTime);
      };

      const connectedHandler = () => {
        console.log('Successfully connected to Ably');
        cleanup();
        resolve();
      };

      const failedHandler = () => {
        console.error('Connection failed, attempting reconnect...');
        attemptReconnect();
      };

      const disconnectedHandler = () => {
        console.warn('Disconnected from Ably, attempting reconnect...');
        attemptReconnect();
      };

      const suspendedHandler = () => {
        console.warn('Connection suspended, attempting reconnect...');
        attemptReconnect();
      };

      this.client.connection.on('connected', connectedHandler);
      this.client.connection.on('failed', failedHandler);
      this.client.connection.on('disconnected', disconnectedHandler);
      this.client.connection.on('suspended', suspendedHandler);

      // Set an overall timeout
      currentTimeout = setTimeout(() => {
        cleanup();
        reject(new Error('Connection timeout after 45 seconds'));
      }, 45000);

      // Initial connection attempt
      this.client.connect();
    });
  }

  public async getChannel(channelName: NotificationChannel) {
    try {
      await this.ensureConnection();

      if (!this.channels.has(channelName)) {
        const channel = this.client.channels.get(channelName);
        this.channels.set(channelName, channel);
        await channel.attach();
      }
      return this.channels.get(channelName)!;
    } catch (error) {
      console.error('Error getting channel:', error);
      // Clean up failed channel
      this.channels.delete(channelName);
      throw error;
    }
  }

  public async subscribe(
    channelName: NotificationChannel,
    callback: (message: NotificationMessage) => void
  ) {
    try {
      const channel = await this.getChannel(channelName);
      channel.subscribe((message) => {
        if (message.data && typeof message.data === 'object') {
          callback(message.data as NotificationMessage);
        } else {
          console.warn('Received invalid message format:', message);
        }
      });
      return () => channel.unsubscribe();
    } catch (error) {
      console.error('Error subscribing to channel:', error);
      throw error;
    }
  }

  public async publish(
    channelName: NotificationChannel,
    message: NotificationMessage
  ) {
    try {
      const channel = await this.getChannel(channelName);
      await channel.publish('message', message);
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  public async enterPresence(channelName: NotificationChannel, data: Record<string, unknown> = {}) {
    try {
      await this.ensureConnection();
      const channel = await this.getChannel(channelName);
      
      // Check if channel is attached before entering presence
      if (channel.state !== 'attached') {
        await channel.attach();
      }
      
      await channel.presence.enter(data);
    } catch (error) {
      console.error('Error entering presence:', error);
      // Clean up channel on error
      this.channels.delete(channelName);
      throw error;
    }
  }

  public async leavePresence(channelName: NotificationChannel) {
    try {
      // Check if we have this channel
      if (!this.channels.has(channelName)) {
        return; // Nothing to leave if we don't have the channel
      }

      await this.ensureConnection();
      const channel = this.channels.get(channelName)!;
      
      // Check if channel is attached
      if (channel.state !== 'attached') {
        console.warn('Channel is not attached, cleaning up local state');
        this.channels.delete(channelName);
        return;
      }

      await channel.presence.leave();
      // Remove channel from map after successful leave
      this.channels.delete(channelName);
    } catch (error) {
      console.error('Error leaving presence:', error);
      // Clean up local state even if there's an error
      this.channels.delete(channelName);
      // Don't throw the error since we're cleaning up anyway
    }
  }

  public async getPresence(channelName: NotificationChannel) {
    try {
      const channel = await this.getChannel(channelName);
      return await channel.presence.get();
    } catch (error) {
      console.error('Error getting presence:', error);
      throw error;
    }
  }

  public disconnect() {
    try {
      this.client.close();
    } finally {
      this.channels.clear();
    }
  }
}

export const createAblyClient = (config: AblyClientConfig) => {
  return new AblyClient(config);
};
