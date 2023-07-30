import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";


const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

export async function authenticeToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Authentication
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) {
    return res.sendStatus(401);
  }

  // Decode the jwt token
  try {
    const paylaod = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    if (!paylaod?.tokenId) {
      return res.sendStatus(401);
    }
    const dbToken = await prisma.token.findUnique({
      where: { id: paylaod.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: "API token expired" });
    }

    req.user = dbToken.user;
  } catch (error) {
    res.status(401).json({ error: `${error}` });
  }

  next();
}
