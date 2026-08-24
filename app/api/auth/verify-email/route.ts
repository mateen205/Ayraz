import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

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

    const allowedFields = ["email", "code"];

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

    const { email, code } = body;

    if (
      typeof email !== "string" ||
      typeof code !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification details.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (
      cleanEmail.length === 0 ||
      cleanEmail.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT
        id,
        email_verified,
        verification_code,
        verification_expires
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
          message: "Invalid verification details.",
        },
        { status: 400 }
      );
    }

    const customer = rows[0];

    if (Boolean(customer.email_verified)) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified.",
      });
    }

    if (!customer.verification_code) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code is no longer available.",
        },
        { status: 400 }
      );
    }

    if (
      !customer.verification_expires ||
      new Date(customer.verification_expires).getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (customer.verification_code !== code) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code.",
        },
        { status: 400 }
      );
    }

    await pool.query(
      `
      UPDATE customers
      SET
        email_verified = 1,
        verification_code = NULL,
        verification_expires = NULL
      WHERE id = ?
      `,
      [customer.id]
    );

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}