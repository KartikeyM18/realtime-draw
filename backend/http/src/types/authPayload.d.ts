import type { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload{
    userId: string;
}