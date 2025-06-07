import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await jwtVerify(token, secret);
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Invalid token");
  }
}

export async function signJWT(payload: { sub: string; email: string }) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ email: payload.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(secret);
    return token;
  } catch (error) {
    console.error("JWT signing failed:", error);
    throw new Error("Failed to create token");
  }
}

export function getJWTSecretKey() {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.warn(
      "Warning: JWT_SECRET is not set or is too short. Using default secret key. This is not secure for production."
    );
  }
  return JWT_SECRET;
} 