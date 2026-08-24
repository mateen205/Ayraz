import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/app/lib/db";

function isValidPassword(password: string) {
  return (
    password.length >= 8 &&
    password.length <= 72 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
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

    const allowedFields = ["token", "password"];

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

    const { token, password } = body;

    if (
      typeof token !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset request.",
        },
        { status: 400 }
      );
    }

    if (token.length !== 64) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset link.",
        },
        { status: 400 }
      );
    }

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset link.",
        },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8-72 characters and contain uppercase, lowercase, and a number.",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT
        id,
        password_reset_expires
      FROM customers
      WHERE password_reset_token = ?
      LIMIT 1
      `,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset link.",
        },
        { status: 400 }
      );
    }

    const customer = rows[0];

    if (
      !customer.password_reset_expires ||
      new Date(customer.password_reset_expires).getTime() <
        Date.now()
    ) {
      await pool.query(
        `
        UPDATE customers
        SET
          password_reset_token = NULL,
          password_reset_expires = NULL
        WHERE id = ?
        `,
        [customer.id]
      );

      return NextResponse.json(
        {
          success: false,
          message: "This reset link has expired.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      `
      UPDATE customers
      SET
        password = ?,
        password_reset_token = NULL,
        password_reset_expires = NULL
      WHERE id = ?
      `,
      [hashedPassword, customer.id]
    );

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}
