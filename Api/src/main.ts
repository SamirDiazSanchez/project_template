import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./user/infrastructure/user.router.js";
import { authRouter } from "./auth/infrastructure/auth.router.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(authRouter);

app.use((err: unknown, _: Request, res: Response, __: NextFunction) => {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
        return;
    }
    return res.status(500).json({ error: "Internal server error" });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});