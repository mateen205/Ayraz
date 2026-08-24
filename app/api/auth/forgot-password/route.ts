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
      SELECT id, email
      FROM customers
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    // Do not reveal whether this email exists.
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    const customer = rows[0];

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await pool.query(
      `
      UPDATE customers
      SET
        password_reset_token = ?,
        password_reset_expires = ?
      WHERE id = ?
      `,
      [
        resetToken,
        resetExpires,
        customer.id,
      ]
    );

    const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";
console.log("RESET BASE URL:", baseUrl);
    const resetUrl =
      `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    await transporter.sendMail({
      from: `"AYRAZ" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "AYRAZ Password Reset",
      text: `Reset your AYRAZ password using this link: ${resetUrl}. This link expires in 15 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#111;color:#fff">
          <h1>AYRAZ</h1>

          <p>You requested a password reset.</p>

          <p>Click the button below to create a new password.</p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:14px 24px;
              background:#fff;
              color:#000;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
              margin:20px 0;
            "
          >
            RESET PASSWORD
          </a>

          <p style="color:#aaa">
            This link expires in 15 minutes.
          </p>

          <p style="color:#aaa">
            If you did not request this, you can safely ignore this email.
          </p>

          <h2>AYRAZ</h2>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}