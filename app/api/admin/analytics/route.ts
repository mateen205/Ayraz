import { NextResponse } from "next/server";
import pool from "../../../lib/db";
export async function GET() {
  try {
    const [revenue]: any = await pool.query(`
      SELECT
      DATE_FORMAT(created_at,'%b') AS month,
      SUM(total) AS revenue
      FROM orders
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `);

    const [topProducts]: any = await pool.query(`
      SELECT
      product_name,
      SUM(quantity) AS sold
      FROM order_items
      GROUP BY product_name
      ORDER BY sold DESC
      LIMIT 5
    `);

    const [latestOrders]: any = await pool.query(`
      SELECT
      id,
      customer_name,
      total,
      status
      FROM orders
      ORDER BY id DESC
      LIMIT 5
    `);

    const [lowStock]: any = await pool.query(`
      SELECT
      id,
      name,
      stock
      FROM products
      WHERE stock <= 5
      ORDER BY stock ASC
    `);

    return NextResponse.json({
      revenue,
      topProducts,
      latestOrders,
      lowStock,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}