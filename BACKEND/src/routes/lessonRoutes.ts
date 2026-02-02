import { Router } from 'express';
import { LessonController } from '../controllers/LessonController';
import { auth } from '../middleware/auth';
// Legacy middleware imports (until refactored)
import adminAuth from '../middleware/adminAuth';
import upload from '../middleware/upload';
// OR import upload if I refactor it next.
// I will refactor upload to TS right now to be clean.

const router = Router();
const lessonController = new LessonController();

router.get('/', lessonController.getAllLessons);
router.get('/:id', lessonController.getLessonById);

router.post('/',
    auth,
    adminAuth,
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    lessonController.createLesson
);

router.put('/:id',
    auth,
    adminAuth,
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    lessonController.updateLesson
);

router.delete('/:id', auth, adminAuth, lessonController.deleteLesson);

export default router;
