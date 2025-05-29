import { Prisma, User } from '../../generated/prisma';
export interface IUserRepository {
  create(data: Omit<Prisma.UserCreateInput, 'id'>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, data: Partial<Prisma.UserUpdateInput>): Promise<User | null>;
  delete(id: number): Promise<User | null>;
}
