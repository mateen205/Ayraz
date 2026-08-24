import { NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/app/lib/auth";

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 1;
const PASSWORD_MAX_LENGTH = 128;
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map<
  string,
  { count: number; firstAttempt: number }
>();
const emailRegex =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

type LoginInput = {
  email: string;
  password: string;
};

function validateLoginInput(body: unknown): LoginInput | null {
  // Body must be a real object
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return null;
  }

  const input = body as Record<string, unknown>;

  // Reject unexpected fields
  const allowedKeys = new Set(["email", "password"]);

  for (const key of Object.keys(input)) {
    if (!allowedKeys.has(key)) {
      return null;
    }
  }

  // Both fields must be strings
  if (
    typeof input.email !== "string" ||
    typeof input.password !== "string"
  ) {
    return null;
  }

  const email = input.email;
  const password = input.password;

  // Strict email validation
  if (
    email.length === 0 ||
    email.length > EMAIL_MAX_LENGTH ||
    !emailRegex.test(email)
  ) {
    return null;
  }

  // Strict password validation
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return null;
  }

  return {
    email,
    password,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Require JSON
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().startsWith("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request format.",
        },
        { status: 415 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON.",
        },
        { status: 400 }
      );
    }

const clientKey =
  request.headers.get("x-forwarded-for") ||
  request.headers.get("x-real-ip") ||
  "unknown";

const now = Date.now();
const attempt = loginAttempts.get(clientKey);

if (attempt) {
  const elapsed = now - attempt.firstAttempt;

  if (elapsed < RATE_LIMIT_WINDOW_MS) {
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many login attempts. Please try again later.",
        },
        { status: 429 }
      );
    }
  } else {
    loginAttempts.delete(clientKey);
  }
}
    const input = validateLoginInput(body);
    

    if (!input) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid login input.",
        },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing from environment."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication is not configured.",
        },
        { status: 500 }
      );
    }

    // Email comparison can be case-insensitive.
    // Password comparison must remain exact.
    const emailMatches =
      input.email.toLowerCase() === adminEmail.toLowerCase();

    const passwordMatches =
      input.password === adminPassword;

   
if (!emailMatches || !passwordMatches) {
  const existingAttempt = loginAttempts.get(clientKey);

  if (existingAttempt) {
    const elapsed = now - existingAttempt.firstAttempt;

    if (elapsed < RATE_LIMIT_WINDOW_MS) {
      existingAttempt.count += 1;
    } else {
      loginAttempts.set(clientKey, {
        count: 1,
        firstAttempt: now,
      });
    }
  } else {
    loginAttempts.set(clientKey, {
      count: 1,
      firstAttempt: now,
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid admin credentials.",
    },
    { status: 401 }
  );
}
    const adminToken = await createAdminSession();

const response = NextResponse.json({
  success: true,
  message: "Admin login successful.",
});

response.cookies.set("admin_session", adminToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
});

return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}