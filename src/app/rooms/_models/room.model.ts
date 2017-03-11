/**
 * Chat room interface
 */
export interface Room {
  id: string;
  title: string;
  createdAt: Date;
  ts?: number;
  isPrivate?: boolean;
}
