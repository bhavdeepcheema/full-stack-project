import express, {Express} from "express";
import morgan from "morgan";
//import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import corsOptions from "../config/cors";
import setupSwagger from "../config/swagger";
import termRoutes from "./api/v1/routes/termRoutes";
import userTermRoutes from "./api/v1/routes/userTermRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";
import cors from "cors";

const app: Express = express();

// test comment added for manual deployment
console.log("trying");
dotenv.config();

// add cors

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// add morgan middleware, combined format logs info about each HTTP request
app.use(morgan("combined"));
app.use(express.json());

// add clerk middleware
app.use(clerkMiddleware());

// invoke swagger middleware for serving docs in /api-docs
setupSwagger(app);

app.get("/",  (_req, res) => {
    res.send("Got response from backend!");
});

app.get("/api/v1/test", (_req, res) => {
  res.send("API route works");
});

app.use("/api/v1", termRoutes);
app.use("/api/v1", userTermRoutes);
app.use(errorHandler); //errorhandler catches errors as last element in middleware chain
// occurs when "next" is invoked

// vercel automatically wraps and uses the app object in deployment
export default app;