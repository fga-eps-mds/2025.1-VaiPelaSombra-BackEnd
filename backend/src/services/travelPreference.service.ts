import { Prisma } from '../generated/prisma';
import { ITravelPreferenceRepository } from '../repositories/travelPreference/travelPreference.repository';

export class TravelPreferenceService {
  constructor(private travelPreferenceRepository: ITravelPreferenceRepository) {}

  async create(userId: number, data: Prisma.TravelPreferenceCreateInput) {
    return this.travelPreferenceRepository.create(userId, data);
  }

  async findByUserId(userId: number) {
    return this.travelPreferenceRepository.findByUserId(userId);
  }

  async update(userId: number, data: Prisma.TravelPreferenceUpdateInput) {
    return this.travelPreferenceRepository.update(userId, data);
  }

  async delete(userId: number) {
    return this.travelPreferenceRepository.delete(userId);
  }
}
