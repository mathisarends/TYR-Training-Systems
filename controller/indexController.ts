import { Request, Response } from "express";

export async function handleIndexRoute(req: Request, res: Response) {

    let isAuthenticated : boolean = false;

    try {
        // @ts-ignore
        const user = await User.findById(req.user?._id);
        isAuthenticated = true;
        
    } catch (error) {
        isAuthenticated = false;

    } finally {
        res.render("index", {
            defaultLayout: true,
            carousel: true,
            isAuthenticated
        });
    }
}