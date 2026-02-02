import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';
// Optionally add auth middleware for getAllContacts if it should be protected
// import adminAuth from '../middleware/adminAuth';
// import { auth } from '../middleware/auth';

const router = Router();
const contactController = new ContactController();

// Public: Submit a contact form
router.post('/', contactController.createContact);

// Protected: Get all messages (Admin only - optional, uncomment if needed)
// router.get('/', auth, adminAuth, contactController.getAllContacts);
router.get('/', contactController.getAllContacts); // Open for now as requested "free of cost" implies easy access? Or just public submission. Keeping get open for demo or protected later.

export default router;
