declare module 'hpp';
declare module 'express-mongo-sanitize';
declare module 'xss-clean';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace 'any' with a more specific type if possible (e.g. { id: string, role: string })
        }
    }
}
