import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from "uuid";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

function sanitizeUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}
export class AuthService {

  static async register(name: string, email: string, password: string) {
    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({ name, email, password: hashedPassword });

    return await userRepo.save(newUser);
  }

  static async login(email: string, password: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokenId for refresh token tracking
    const tokenId = uuidv4();

    // Create tokens including tokenId in refresh token payload
    const accessToken = jwt.sign(
      { id: user.id },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, tokenId },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { user:sanitizeUser(user), accessToken, refreshToken, tokenId };
  }

  static async refresh(token: string) {
    try {
      if (!REFRESH_SECRET || !ACCESS_SECRET) {
        throw new Error("JWT secrets not defined");
      }

      const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string; tokenId?: string };

      // You can add Redis tokenId verification here if you want

      const accessToken = jwt.sign(
        { id: decoded.id },
        ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      return accessToken;
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  static async verifyRefreshToken(token: string): Promise<{ userId: string; tokenId: string }> {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET) as unknown;

      if (
        typeof payload === "object" &&
        payload !== null &&
        "id" in payload &&
        "tokenId" in payload &&
        typeof (payload as any).id === "string" &&
        typeof (payload as any).tokenId === "string"
      ) {
        return { userId: (payload as any).id, tokenId: (payload as any).tokenId };
      } else {
        throw new Error("Invalid token payload");
      }
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}
