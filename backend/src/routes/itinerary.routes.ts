import { Router } from 'express';
import { createItinerary, deleteItinerary, findByUserId, findByUserItineraryId, updateItinerary } from '../controllers/intinerary.controller';

const router = Router();

// Create
router.post('/:userId', createItinerary);
// Read
router.get('/:userId', findByUserId);
router.get('/:userId/:itineraryId', findByUserItineraryId);
// Update
router.put('/:itineraryId', updateItinerary);
// Delete
router.delete('/:itineraryId', deleteItinerary);

export default router;
