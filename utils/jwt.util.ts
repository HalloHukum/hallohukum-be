import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function signToken(data: object): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  const token = jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn });
  return token;
}

export function verifyToken(token: string): string | jwt.JwtPayload {
  const data = jwt.verify(token, process.env.JWT_SECRET as string);
  return data;
}
