export interface Message {
  id: string;
  user: string;
  text: string;
  createdAt: Date;
  isPending?: boolean;
  verificationToken?: string;
}
