import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/app/lib/db";
import transporter from "@/app/lib/mail";

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

    const allowedFields = ["email"];

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

    const { email } = body;

    if (typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
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
          message: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        email_verified
      FROM customers
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    // Don't reveal whether an email exists.
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, a new verification code has been sent.",
      });
    }

    const customer = rows[0];

    if (Boolean(customer.email_verified)) {
      return NextResponse.json({
        success: true,
        message: "This email is already verified.",
      });
    }

    const verificationCode = crypto
      .randomInt(100000, 1000000)
      .toString();

    const verificationExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await pool.query(
      `
      UPDATE customers
      SET
        verification_code = ?,
        verification_expires = ?
      WHERE id = ?
      `,
      [
        verificationCode,
        verificationExpires,
        customer.id,
      ]
    );

    await transporter.sendMail({
      from: `"AYRAZ" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "AYRAZ Email Verification",
      text: `Your new AYRAZ verification code is ${verificationCode}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px">
          <h1>AYRAZ</h1>

          <p>Hello ${customer.name},</p>

          <p>Your new email verification code is:</p>

          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:25px 0">
            ${verificationCode}
          </div>

          <p>This code expires in 10 minutes.</p>

          <p>If you didn't request a new code, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}