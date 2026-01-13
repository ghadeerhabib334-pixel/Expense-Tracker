export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}
