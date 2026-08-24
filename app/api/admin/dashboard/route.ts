import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [orders]: any = await pool.query(
      "SELECT COUNT(*) AS totalOrders FROM orders"
    );

    const [pending]: any = await pool.query(
      "SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'Pending'"
    );

    const [revenue]: any = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders"
    );

    const [products]: any = await pool.query(
      "SELECT COALESCE(SUM(quantity), 0) AS productsSold FROM order_items"
    );

    return NextResponse.json({
      totalOrders: Number(orders[0]?.totalOrders || 0),
      pendingOrders: Number(pending[0]?.pendingOrders || 0),
      totalRevenue: Number(revenue[0]?.totalRevenue || 0),
      productsSold: Number(products[0]?.productsSold || 0),
    });

  } catch (err: any) {
    console.error("ADMIN DASHBOARD DATABASE ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error:
          process.env.NODE_ENV === "development"
            ? err?.message
            : undefined,
      },
      { status: 500 }
    );
  }
}