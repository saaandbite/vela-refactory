
// plugins/vela-backend/src/services/ChatService.ts
import { Knex } from 'knex';
import { Logger } from 'winston';
import { DatabaseManager } from '@backstage/backend-common';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs for chat sessions

// --- Interfaces for Data Models ---
export interface User {
  id?: number;
  github_username: string;
  backstage_user_ref: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface ChatSession {
  id?: string; // UUID
  user_id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id?: number;
  session_id: string; // UUID
  input_prompt?: string;
  output_content?: string;
  output_type?: 'api_spec' | 'text' | 'error';
  status: 'completed' | 'failed' | 'pending';
  created_at?: string;
}

// --- Chat Service Interface ---
export interface ChatService {
  findOrCreateUser(userData: {
    github_username: string;
    backstage_user_ref: string;
    display_name?: string;
    avatar_url?: string;
  }): Promise<User>;
  createChatSession(userId: number, title: string): Promise<ChatSession>;
  addChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage>;
  listChatSessions(userId: number): Promise<ChatSession[]>;
  listChatMessages(sessionId: string): Promise<ChatMessage[]>;
}

// --- Database Chat Service Implementation ---
export class DatabaseChatService implements ChatService {
  private readonly client: Knex;
  private readonly logger: Logger;

  private constructor(client: Knex, logger: Logger) {
    this.client = client;
    this.logger = logger;
  }

  static async create(
    database: DatabaseManager,
    logger: Logger,
  ): Promise<DatabaseChatService> {
    const client = await database.getClient();
    return new DatabaseChatService(client, logger);
  }

  async findOrCreateUser(userData: {
    github_username: string;
    backstage_user_ref: string;
    display_name?: string;
    avatar_url?: string;
  }): Promise<User> {
    let user = await this.client<User>('users')
      .where({ github_username: userData.github_username })
      .first();

    if (!user) {
      this.logger.info(`Creating new user: ${userData.github_username}`);
      [user] = await this.client<User>('users')
        .insert(userData)
        .returning('*');
    } else {
      this.logger.debug(`Found existing user: ${userData.github_username}`);
    }
    return user;
  }

  async createChatSession(userId: number, title: string): Promise<ChatSession> {
    this.logger.info(`Creating new chat session for user ${userId} with title: ${title}`);
    const [session] = await this.client<ChatSession>('chat_sessions')
      .insert({ id: uuidv4(), user_id: userId, title })
      .returning('*');
    return session;
  }

  async addChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    this.logger.info(`Adding new chat message to session ${message.session_id}`);
    const [chatMessage] = await this.client<ChatMessage>('chat_messages')
      .insert(message)
      .returning('*');
    
    // Update updated_at for the session
    await this.client<ChatSession>('chat_sessions')
      .where({ id: message.session_id })
      .update({ updated_at: this.client.fn.now() });

    return chatMessage;
  }

  async listChatSessions(userId: number): Promise<ChatSession[]> {
    this.logger.info(`Listing chat sessions for user ${userId}`);
    const sessions = await this.client<ChatSession>('chat_sessions')
      .where({ user_id: userId })
      .orderBy('updated_at', 'desc');
    return sessions;
  }

  async listChatMessages(sessionId: string): Promise<ChatMessage[]> {
    this.logger.info(`Listing chat messages for session ${sessionId}`);
    const messages = await this.client<ChatMessage>('chat_messages')
      .where({ session_id: sessionId })
      .orderBy('created_at', 'asc');
    return messages;
  }
}
