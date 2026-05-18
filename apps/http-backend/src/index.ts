import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import authRoutes from './routes/auth.Routes.js'
import projectRoutes from "./routes/project.Routes.js";
import profileRoutes from "./routes/profile.Routes.js";
import submitRoutes from "./routes/submit.Routes.js";
import starRoutes from "./routes/star.Routes.js";
import connectRoutes from "./routes/connect.Routes.js";
import { connectRedis } from '@repo/redis/client'
import notificationRoutes from './routes/notification.Routes.js'
import chatRoutes from './routes/chat.routes.js'

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
    }
  }
}

const secret = process.env.JWT_SECRET!;
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const PORT = process.env.PORT || 3001

const app = express()
app.set('trust proxy', 1);
const frontend=["http://localhost:3000","http://frontend:3000"]

app.use(express.json())
app.use(cors({
  origin: frontend,
  credentials: true
}))
app.use(cookieParser())
app.use(passport.initialize())

await connectRedis()

app.use("/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/submit", submitRoutes);
app.use("/api/v1/star", starRoutes);
app.use("/api/v1/connect", connectRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/chats", chatRoutes);

// next: not complted
app.post("/api/v1/connect", async (req, res) => {
  // connection between owner and dev
})

app.listen(PORT, () => {
  console.log(process.env.DATABASE_URL)
  console.log("Listening on port: " + PORT)
})