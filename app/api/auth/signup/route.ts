import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/app/lib/db";
import transporter from "@/app/lib/mail";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidName(name: string) {
  return /^[A-Za-zÀ-ÿ\s'-]{2,100}$/.test(name);
}
function isValidPassword(password: string) {
  return (
    password.length >= 8 &&
    password.length <= 72 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
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
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const allowedFields = ["name", "email", "password"];

    const extraFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (extraFields.length > 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request fields." },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidName(cleanName)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid name.",
        },
        { status: 400 }
      );
    }

    if (
      cleanEmail.length > 150 ||
      !isValidEmail(cleanEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          success: false,
         message:
  "Password must be 8-72 characters and contain uppercase, lowercase, a number, and a special character.",
        },
        { status: 400 }
      );
    }

    const [existing]: any = await pool.query(
      "SELECT id, email_verified FROM customers WHERE email = ?",
      [cleanEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `
      INSERT INTO customers
      (
        name,
        email,
        password,
        email_verified,
        verification_code,
        verification_expires
      )
      VALUES (?, ?, ?, 0, ?, ?)
      `,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        verificationCode,
        expires,
      ]
    );

    await transporter.sendMail({
      from: `"AYRAZ" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "AYRAZ Email Verification",
      text: `Your AYRAZ verification code is ${verificationCode}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h1>AYRAZ</h1>
          <p>Welcome to AYRAZ.</p>
          <p>Your verification code is:</p>

          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:25px 0">
            ${verificationCode}
          </div>

          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Account created. Please check your email for the verification code.",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}