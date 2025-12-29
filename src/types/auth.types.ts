import { Request } from "express";

export interface AccessTokenPayload {
  sub: string;
  roles: string[];
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
}
