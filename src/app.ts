import { type Prisma, PrismaClient } from "@prisma/client";
import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";

const prisma = new PrismaClient();
const app: Application = express();

app.use(express.json());

class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const result = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  res.json(result);
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/exercises", async (req, res) => {
  const { skip, take, orderBy } = req.query;

  const posts = await prisma.exercise.findMany({
    // where: {
    //   published: true,
    // },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  });

  res.json(posts);
});

// Error handling Middleware function for logging the error message
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(`error ${error.message}`);
  next(error);
});

app.use((req: Request, res: Response) => {
  res.status(404).send("Resource not found!");
});

// Error handling Middleware function reads the error message and sends JSON response
app.use((error: AppError, req: Request, res: Response) => {
  const status = error.statusCode || 400;
  res.status(status).json({ message: error.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
