import { ITravelInterestRepository } from '../repositories/travelInterest/travelInterest.repository';
import { TravelInterest } from '../generated/prisma';

export class TravelInterestService {
  constructor(private travelInterestRepository: ITravelInterestRepository) {}

  async create(data: Omit<TravelInterest, 'id'>) {
    return this.travelInterestRepository.create(data);
  }

  async findById(id: number) {
    return this.travelInterestRepository.findById(id);
  }

  async findAll(): Promise<TravelInterest[]> {
    return this.travelInterestRepository.findAll();
  }

  async update(id: number, data: Partial<TravelInterest>) {
    return this.travelInterestRepository.update(id, data);
  }

  async delete(id: number) {
    return this.travelInterestRepository.delete(id);
  }
}
