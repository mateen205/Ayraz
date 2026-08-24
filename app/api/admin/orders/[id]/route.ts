import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [orders]: any = await pool.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const [items]: any = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id]
    );

    return NextResponse.json({
      order: orders[0],
      items,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );

  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    // Only allow valid order statuses
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      typeof body.status !== "string" ||
      !allowedStatuses.includes(body.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        {
          status: 400,
        }
      );
    }

    await pool.query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [body.status, id]
    );

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}