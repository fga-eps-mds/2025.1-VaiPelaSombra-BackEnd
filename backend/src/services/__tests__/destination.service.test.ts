
// Import the mock setup FIRST to ensure it's applied before the service import
import { prismaMock } from '../../data/prismaMock';
import { DestinationService } from '../destination.service';
import { CreateDestinationDTO, UpdateDestinationDTO } from '../../dtos/destination.dto';
import { Destination } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('DestinationService', () => {
    let destinationService: DestinationService;

    beforeEach(() => {
        destinationService = new DestinationService();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new destination successfully', async () => {
            const createDestinationData: CreateDestinationDTO = {
                title: 'Test Destination',
                description: 'A beautiful test destination',
                longitude: -122.4194,
                latitude: 37.7749,
                localClimate: 'Mediterranean',
                timeZone: 'America/Los_Angeles'
            };

            const mockCreatedDestination: Destination = {
                id: 1,
                title: createDestinationData.title,
                description: createDestinationData.description,
                longitude: new Decimal(createDestinationData.longitude),
                latitude: new Decimal(createDestinationData.latitude),
                localClimate: createDestinationData.localClimate || null,
                timeZone: createDestinationData.timeZone || null,
            };

            prismaMock.destination.create.mockResolvedValue(mockCreatedDestination);

            const result = await destinationService.create(createDestinationData);

            expect(result).toEqual(mockCreatedDestination);
            expect(prismaMock.destination.create).toHaveBeenCalledWith({
                data: {
                    title: createDestinationData.title,
                    description: createDestinationData.description,
                    longitude: createDestinationData.longitude,
                    latitude: createDestinationData.latitude,
                    localClimate: createDestinationData.localClimate,
                    timeZone: createDestinationData.timeZone,
                    itineraries: {},
                    reviews: {},
                    localEvents: {},
                    survivalTips: {},
                    images: {},
                }
            });
        });
    });

    describe('deleteDestination', () => {
        it('should delete a destination successfully', async () => {
            const destinationId = 1;
            const mockDeletedDestination: Destination = {
                id: destinationId,
                title: 'Test Destination',
                description: 'A beautiful test destination',
                longitude: new Decimal(-122.4194),
                latitude: new Decimal(37.7749),
                localClimate: 'Mediterranean',
                timeZone: 'America/Los_Angeles',
            };

            prismaMock.destination.delete.mockResolvedValue(mockDeletedDestination);

            const result = await destinationService.deleteDestination(destinationId);

            expect(result).toEqual(mockDeletedDestination);
            expect(prismaMock.destination.delete).toHaveBeenCalledWith({
                where: { id: destinationId }
            });
        });
    });
    describe('getDestinationById', () => {
        it('should retrieve a destination by ID successfully', async () => {
            const destinationId = 1;
            const mockDestination: Destination = {
                id: destinationId,
                title: 'Test Destination',
                description: 'A beautiful test destination',
                longitude: new Decimal(-122.4194),
                latitude: new Decimal(37.7749),
                localClimate: 'Mediterranean',
                timeZone: 'America/Los_Angeles',
            };

            prismaMock.destination.findUnique.mockResolvedValue(mockDestination);

            const result = await destinationService.getDestinationById(destinationId);

            expect(result).toEqual(mockDestination);
            expect(prismaMock.destination.findUnique).toHaveBeenCalledWith({
                where: { id: destinationId }
            });
        });
    });
    describe('getAllDestinations', () => {
        it('should retrieve all destinations successfully', async () => {
            const mockDestinations: Destination[] = [
                {
                    id: 1,
                    title: 'Test Destination 1',
                    description: 'A beautiful test destination 1',
                    longitude: new Decimal(-122.4194),
                    latitude: new Decimal(37.7749),
                    localClimate: 'Mediterranean',
                    timeZone: 'America/Los_Angeles',
                },
                {
                    id: 2,
                    title: 'Test Destination 2',
                    description: 'A beautiful test destination 2',
                    longitude: new Decimal(-73.935242),
                    latitude: new Decimal(40.730610),
                    localClimate: 'Continental',
                    timeZone: 'America/New_York',
                }
            ];

            prismaMock.destination.findMany.mockResolvedValue(mockDestinations);

            const result = await destinationService.getAllDestinations();

            expect(result).toEqual(mockDestinations);
            expect(prismaMock.destination.findMany).toHaveBeenCalled();
        });
    });
    describe('updateDestination', () => {
        it('should update a destination successfully', async () => {
            const destinationId = 1;
            const updateData: UpdateDestinationDTO = {
                title: 'Updated Destination',
                description: 'An updated beautiful destination',
                longitude: -122.4194,
                latitude: 37.7749,
                localClimate: 'Mediterranean',
                timeZone: 'America/Los_Angeles'
            };

            const mockUpdatedDestination: Destination = {
                id: destinationId,
                title: updateData.title!,
                description: updateData.description!,
                longitude: new Decimal(updateData.longitude!),
                latitude: new Decimal(updateData.latitude!),
                localClimate: updateData.localClimate || null,
                timeZone: updateData.timeZone || null,
            };

            prismaMock.destination.update.mockResolvedValue(mockUpdatedDestination);

            const result = await destinationService.update(destinationId, updateData);

            expect(result).toEqual(mockUpdatedDestination);
            expect(prismaMock.destination.update).toHaveBeenCalledWith({
                where: { id: destinationId },
                data: {
                    title: updateData.title,
                    description: updateData.description,
                    longitude: updateData.longitude,
                    latitude: updateData.latitude,
                    localClimate: updateData.localClimate,
                    timeZone: updateData.timeZone
                }
            });
        });
    })
})