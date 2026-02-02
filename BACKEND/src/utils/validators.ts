import { check, validationResult } from 'express-validator'; // check is deprecated, use body/check
import { Request, Response, NextFunction } from 'express';

export const validateSignup = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

export const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

export const validateLesson = [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').isIn(['beginner', 'intermediate', 'advanced']),
    check('instructor', 'Instructor is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric()
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
