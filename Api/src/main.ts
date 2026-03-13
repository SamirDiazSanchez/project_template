import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./user/infrastructure/user.router.js";
import { authRouter } from "./auth/infrastructure/auth.router.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});