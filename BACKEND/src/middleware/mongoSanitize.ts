import { Request, Response, NextFunction } from 'express';

const TEST_REGEX = /^\$|\./;
const TEST_REGEX_WITHOUT_DOT = /^\$/;
const REPLACE_REGEX = /^\$|\./g;

function isPlainObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
}

function getTestRegex(allowDots?: boolean): RegExp {
    return allowDots ? TEST_REGEX_WITHOUT_DOT : TEST_REGEX;
}

function withEach(target: any, cb: (obj: any, val: any, key: string) => { shouldRecurse: boolean; key?: string }) {
    (function act(obj: any) {
        if (Array.isArray(obj)) {
            obj.forEach(act);
        } else if (isPlainObject(obj)) {
            Object.keys(obj).forEach(function (key) {
                const val = obj[key];
                const resp = cb(obj, val, key);
                if (resp.shouldRecurse) {
                    act(obj[resp.key || key]);
                }
            });
        }
    })(target);
}

function _sanitize(target: any, options: any) {
    const regex = getTestRegex(options.allowDots);
    let isSanitized = false;
    let replaceWith: string | null = null;
    const dryRun = Boolean(options.dryRun);

    if (!regex.test(options.replaceWith) && options.replaceWith !== '.') {
        replaceWith = options.replaceWith;
    }

    withEach(target, function (obj, val, key) {
        let shouldRecurse = true;

        if (regex.test(key)) {
            isSanitized = true;
            if (dryRun) {
                return {
                    shouldRecurse: shouldRecurse,
                    key: key,
                };
            }
            delete obj[key];
            if (replaceWith) {
                key = key.replace(REPLACE_REGEX, replaceWith);
                if (
                    key !== '__proto__' &&
                    key !== 'constructor' &&
                    key !== 'prototype'
                ) {
                    obj[key] = val;
                }
            } else {
                shouldRecurse = false;
            }
        }

        return {
            shouldRecurse: shouldRecurse,
            key: key,
        };
    });

    return {
        isSanitized,
        target,
    };
}

export function mongoSanitize(options: any = {}) {
    const hasOnSanitize = typeof options.onSanitize === 'function';
    return function (req: Request, res: Response, next: NextFunction) {
        ['body', 'params', 'headers', 'query'].forEach(function (key) {
            if ((req as any)[key]) {
                const { target, isSanitized } = _sanitize((req as any)[key], options);
                // req[key] = target; // REMOVED: In Express 5, some properties like query are getters and cannot be set. 
                // _sanitize modifies the object in-place, so assignment is unnecessary.

                if (isSanitized && hasOnSanitize) {
                    options.onSanitize({
                        req,
                        key,
                    });
                }
            }
        });
        next();
    };
}
