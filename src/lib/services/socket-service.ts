import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5004"; // Update this with your actual backend URL

class SocketService {
  private socket: Socket | null = null;

  /**
   * Initialize socket connection
   */
  connect(): void {
    if (!this.socket) {
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
      });

      this.socket.on("disconnect", () => {
      });
    }
  }

  /**
   * Register a user with their userId
   */
  registerUser(userId: string): void {
    if (this.socket) {
      this.socket.emit("register", userId);
    }
  }

  /**
   * Join a collaboration room
   */
  joinCollaboration(collaborationId: string|string[]): void {
    if (this.socket) {
      this.socket.emit("joinCollaboration", collaborationId);
    }
  }

  /**
   * Listen for real-time Join a collaboration room
   */
  joinedCollaborationRoom(callback: (data: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on("joinedCollaborationRoom", callback);
    }
  }
  /**
   * Listen for real-time Join a collaboration room
   */
  joinedCollaborationMessages(
    callback: (data: { message: string }) => void
  ): void {
    if (this.socket) {
      this.socket.on("newCollaborationMessage", callback);
    }
  }

  /**
   * Leave a collaboration room
   */
  leaveCollaboration(): void {
    if (this.socket) {
      this.socket.emit("leaveCollaboration");
    }
  }

  /**
   * Send a message to the collaboration room
   */
  sendMessage(
    collaborationId: string,
    message: string,
    creatorId?: string,
    vendorId?: string
  ): void {
    if (this.socket) {
      this.socket.emit("collaborationMessage", {
        message,
        creatorId,
        vendorId,
      });
    }
  }

  /**
   * Listen for new collaboration messages
   */
  onNewMessage(callback: (data: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on("newCollaborationMessage", callback);
    }
  }

  /**
   * Listen for real-time notifications
   */
  onNotification(callback: (data: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  /**
   * Disconnect the socket connection
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export a singleton instance
const socketService = new SocketService();
export default socketService;
