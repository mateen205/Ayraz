import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not configured");
}

const secretKey = new TextEncoder().encode(secret);

// ================================
// CUSTOMER SESSION
// ================================

export async function createSession(customerId: number) {
  return await new SignJWT({
    customerId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (!payload.customerId) {
      return null;
    }

    return {
      customerId: Number(payload.customerId),
    };
  } catch {
    return null;
  }
}

// ================================
// ADMIN SESSION
// ================================

export async function createAdminSession() {
  return await new SignJWT({
    admin: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (payload.admin !== true) {
      return null;
    }

    return {
      admin: true,
    };
  } catch {
    return null;
  }
}