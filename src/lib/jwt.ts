import { jwtVerify, SignJWT } from "jose";
import { UserRole } from "@/contexts/user-context";

// Ensure JWT_SECRET is at least 32 characters long for security
const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_key_min_32_chars_long_123";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export async function verifyJWT(token: string) {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload || !payload.sub) {
      throw new Error("Invalid token payload");
    }

    return { payload };
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw error;
  }
}

export async function signJWT(payload: {
  sub: string;
  email: string;
  role: UserRole;
}) {
  try {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new Error("Missing required payload fields");
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      email: payload.email,
      role: payload.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(secret);

    return token;
  } catch (error) {
    console.error("JWT signing failed:", error);
    throw error;
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
