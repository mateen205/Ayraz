import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/app/lib/db";
import { cookies } from "next/headers";
import { createSession } from "@/app/lib/auth";
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request.",
        },
        { status: 400 }
      );
    }

    const allowedFields = ["email", "password"];

    const extraFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (extraFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request fields.",
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (
      cleanEmail.length === 0 ||
      cleanEmail.length > 150 ||
      !isValidEmail(cleanEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (password.length < 8 || password.length > 72) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        email_verified
      FROM customers
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const customer = rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      customer.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (!Boolean(customer.email_verified)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in.",
          needsVerification: true,
          email: customer.email,
        },
        { status: 403 }
      );
    }

    const sessionToken = await createSession(Number(customer.id));

const cookieStore = await cookies();

cookieStore.set("ayraz_session", sessionToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return NextResponse.json({
  success: true,
  message: "Login successful.",
  customer: {
    id: customer.id,
    name: customer.name,
    email: customer.email,
  },
});
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}