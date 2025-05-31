import { CreateItineraryDTO, UpdateItineraryDTO } from '../dtos/itinerary.dto';
import { IItineraryRepository } from '../repositories/itinerary/itinerary.reposity';
export class ItineraryService {
  constructor(private itineraryRepository: IItineraryRepository) {}

  async create(userId: number, data: CreateItineraryDTO) {
    return this.itineraryRepository.create(userId, data);
  }

  async update(id: number, data: UpdateItineraryDTO) {
    return this.itineraryRepository.update(id, data);
  }

  async delete(id: number) {
    return this.itineraryRepository.delete(id);
  }

  async findByUserId(userId: number) {
    return this.itineraryRepository.findByUserId(userId);
  }
}
