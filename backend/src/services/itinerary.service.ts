import { Prisma } from '../generated/prisma';
import { IItineraryRepository } from '../repositories/itinerary/itinerary.reposity';
export class ItineraryService {
  constructor(private itineraryRepository: IItineraryRepository) {}

  async create(data: Prisma.ItineraryCreateInput) {
    return this.itineraryRepository.create(data);
  }

  async update(id: number, data: Prisma.ItineraryUpdateInput) {
    return this.itineraryRepository.update(id, data);
  }

  async delete(id: number) {
    return this.itineraryRepository.delete(id);
  }

  async findByUserId(userId: number) {
    return this.itineraryRepository.findByUserId(userId);
  }
}
