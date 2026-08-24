import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import { verifySession } from "@/app/lib/auth";

// GET Reviews
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing productId",
        },
        {
          status: 400,
        }
      );
    }

    const [reviews] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        id,
        customer_name,
        rating,
        review,
        created_at
      FROM product_reviews
      WHERE product_id = ?
      AND approved = 1
      ORDER BY created_at DESC
      `,
      [productId]
    );

    const [stats]: any = await pool.query(
      `
      SELECT
        COUNT(*) AS total,
        ROUND(AVG(rating),1) AS average
      FROM product_reviews
      WHERE product_id = ?
      AND approved = 1
      `,
      [productId]
    );

    return NextResponse.json({
      success: true,
      reviews,
      total: stats[0].total || 0,
      average: stats[0].average || 0,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

// POST Review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
const cookieStore = await cookies();

const sessionToken =
  cookieStore.get("ayraz_session")?.value;

if (!sessionToken) {
  return NextResponse.json(
    {
      success: false,
      message: "Please log in to submit a review.",
    },
    { status: 401 }
  );
}

const session = await verifySession(sessionToken);

if (!session) {
  return NextResponse.json(
    {
      success: false,
      message: "Your session has expired. Please log in again.",
    },
    { status: 401 }
  );
}

const customerId = session.customerId;

    const {
      product_id,
      customer_name,
      rating,
      review,
    } = body;
    const [purchaseRows] = await pool.query<RowDataPacket[]>(
  `
  SELECT oi.product_id
  FROM order_items oi
  INNER JOIN orders o
    ON o.id = oi.order_id
  WHERE o.email = (
    SELECT email
    FROM customers
    WHERE id = ?
    LIMIT 1
  )
  AND oi.product_id = ?
  LIMIT 1
  `,
  [customerId, product_id]
);
if (purchaseRows.length === 0) {
  return NextResponse.json(
    {
      success: false,
      message: "You can only review products you have purchased.",
    },
    { status: 403 }
  );
}
   if (
  !product_id ||
  !customer_name ||
  !review ||
  !Number.isInteger(Number(rating)) ||
  Number(rating) < 1 ||
  Number(rating) > 5
) {
  return NextResponse.json(
    {
      success: false,
      message: "Rating must be a whole number from 1 to 5.",
    },
    { status: 400 }
  );
}if (
  !product_id ||
  !customer_name ||
  !review ||
  !Number.isInteger(Number(rating)) ||
  Number(rating) < 1 ||
  Number(rating) > 5
) {
  return NextResponse.json(
    {
      success: false,
      message: "Rating must be a whole number from 1 to 5.",
    },
    { status: 400 }
  );
}
if (review.trim().length < 10 || review.trim().length > 1000) {
  return NextResponse.json(
    {
      success: false,
      message: "Review must be between 10 and 1000 characters.",
    },
    { status: 400 }
  );
}

    await pool.query<ResultSetHeader>(
      `
      INSERT INTO product_reviews
      (
        product_id,
        customer_name,
        rating,
        review,
        approved
      )
      VALUES
      (?, ?, ?, ?, 1)
      `,
      [
        product_id,
        customer_name,
        rating,
        review,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been submitted.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}