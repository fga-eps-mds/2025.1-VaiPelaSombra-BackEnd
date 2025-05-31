import { CreateItineraryDTO } from '../../dtos/itinerary.dto';
import { Prisma, Itinerary } from '../../generated/prisma';

export interface IItineraryRepository {
  create(userId: number, data: CreateItineraryDTO): Promise<Itinerary>;
  update(id: number, data: Prisma.ItineraryUpdateInput): Promise<Itinerary | null>;
  delete(id: number): Promise<Itinerary | null>;
  findByUserId(id: number): Promise<Itinerary[] | null>;
}
