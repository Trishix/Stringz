import { Request, Response } from 'express';

export abstract class BaseController {

    public ok<T>(res: Response, dto?: T) {
        if (!!dto) {
            res.type('application/json');
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

    public created<T>(res: Response, dto?: T) {
        if (!!dto) {
            res.type('application/json');
            return res.status(201).json(dto);
        } else {
            return res.sendStatus(201);
        }
    }

    public clientError(res: Response, message?: string) {
        return this.jsonResponse(res, 400, message ? message : 'Unauthorized');
    }

    public unauthorized(res: Response, message?: string) {
        return this.jsonResponse(res, 401, message ? message : 'Unauthorized');
    }

    public forbidden(res: Response, message?: string) {
        return this.jsonResponse(res, 403, message ? message : 'Forbidden');
    }

    public notFound(res: Response, message?: string) {
        return this.jsonResponse(res, 404, message ? message : 'Not found');
    }

    public fail(res: Response, error: Error | string) {
        console.log(error);
        return res.status(500).json({
            message: error.toString()
        });
    }

    private jsonResponse(res: Response, code: number, message: string) {
        return res.status(code).json({ message });
    }
}
