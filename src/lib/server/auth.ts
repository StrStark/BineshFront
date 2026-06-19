import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "binesh-panel-dev-secret-key-change-in-production"
);

const ACCESS_TOKEN_EXPIRY = "5m";
const REFRESH_TOKEN_EXPIRY = "14d";

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
  sessionId?: string;
}

export async function signAccessToken(payload: JwtPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(SECRET);
}

export async function signRefreshToken(payload: JwtPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as unknown as JwtPayload;
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("authToken", accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("userId");
  cookieStore.delete("userSessionId");
}

export async function getServerSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) return null;

  try {
    return await verifyToken(authToken);
  } catch {
    return null;
  }
}
