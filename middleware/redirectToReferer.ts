import { Request, Response } from "express"

export function redirectToReferer(req: Request, res: Response) {
    const referer = req.headers.referer ||"/";
    res.redirect(referer);
}