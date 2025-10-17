import { conversations, messages, type Conversation, type Message, type InsertConversation, type InsertMessage } from "@shared/schema";

export interface IStorage {
  // Conversation methods
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(sessionId: string): Promise<Conversation | undefined>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(conversationId: number): Promise<Message[]>;
  getConversationHistory(sessionId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private conversationId: number;
  private messageId: number;

  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.conversationId = 1;
    this.messageId = 1;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(sessionId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.sessionId === sessionId
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      metadata: insertMessage.metadata || null,
      conversationId: insertMessage.conversationId || 0,
      htmlContent: insertMessage.htmlContent || null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getConversationHistory(sessionId: string): Promise<Message[]> {
    const conversation = await this.getConversation(sessionId);
    if (!conversation) return [];
    return this.getMessages(conversation.id);
  }
}

export const storage = new MemStorage();
