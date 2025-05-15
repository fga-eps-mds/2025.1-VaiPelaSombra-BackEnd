import { User } from '../models/user.model';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../../src/data/users.json');

// Helper function to read users
const readUsers = (): User[] => {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return error;
  }
};

// Helper function to write users
const writeUsers = (users: User[]) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf-8');
};

export const UserService = {
  getAllUsers: (): User[] => {
    return readUsers();
  },

  getUserById: (id: string): User | undefined => {
    const users = readUsers();
    return users.find((user) => user.id === id);
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = readUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
  },

  updateUser: (id: string, updateData: Partial<Omit<User, 'id'>>): User | undefined => {
    const users = readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) return undefined;

    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    writeUsers(users);
    return updatedUser;
  },

  deleteUser: (id: string): boolean => {
    const users = readUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter((user) => user.id !== id);

    if (filteredUsers.length === initialLength) return false;

    writeUsers(filteredUsers);
    return true;
  },
};
