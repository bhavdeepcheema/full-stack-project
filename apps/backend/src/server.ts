import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const PORT = Number(process.env.PORT ?? 3000);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is running");
});

app.get("/api/v1/terms", async (_req: Request, res: Response) => {
  const terms = await prisma.term.findMany({
    orderBy: { title: "asc" },
  });

  res.json(
    terms.map((t) => ({
      id: t.id,
      term: t.title,
      definition: t.definition,
      createdAt: t.createdAt,
    }))
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
