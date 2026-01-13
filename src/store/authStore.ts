import { create } from 'zustand';
import { User } from '../types/User';

const USERS_KEY = 'expense-tracker-users';
const CURRENT_USER_KEY = 'expense-tracker-current-user';

interface AuthStore {
  currentUser: User | null;
  users: User[];
  login: (emailOrUsername: string, password: string) => boolean;
  register: (email: string, username: string, password: string) => boolean;
  logout: () => void;
  loadAuth: () => void;
}

// Load users from localStorage
const loadUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

// Load current user from localStorage
const loadCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Save current user to localStorage
const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Failed to save current user:', error);
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  users: [],
  
  loadAuth: () => {
    const users = loadUsers();
    const currentUser = loadCurrentUser();
    set({ users, currentUser });
  },
  
  login: (emailOrUsername: string, password: string) => {
    const users = loadUsers();
    const user = users.find(
      (u) => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );
    
    if (user) {
      saveCurrentUser(user);
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  
  register: (email: string, username: string, password: string) => {
    const users = loadUsers();
    
    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email or username already exists (case-insensitive for email)
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail || u.username.toLowerCase() === username.toLowerCase().trim())) {
      return false;
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email: normalizedEmail, // Store email in lowercase
      username: username.trim(),
      password, // In production, hash this
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);
    set({ users: updatedUsers, currentUser: newUser });
    return true;
  },
  
  logout: () => {
    saveCurrentUser(null);
    set({ currentUser: null });
  },
}));
