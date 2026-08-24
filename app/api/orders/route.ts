import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import transporter from "@/app/lib/mail";

type CartItem = {
  id: string;
  quantity: number;
  size: string;
};

export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();

  try {
    const body = await request.json();

   const {
  customer_name,
  phone,
  email,
  city,
  province,
  postal_code,
  address,
  payment_method,
  delivery_method,
  notes,
  items,
} = body;
    // -----------------------------
    // Basic Validation
    // -----------------------------

    if (
      !customer_name ||
      !phone ||
      !city ||
      !address
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        {
          status: 400,
        }
      );
    }

    await connection.beginTransaction();

    let subtotal = 0;
    const shipping =
  delivery_method === "express" ? 350 : 0;

    const verifiedItems: any[] = [];

    // -----------------------------
    // Verify every product
    // -----------------------------

    for (const item of items as CartItem[]) {

      const [rows] = await connection.query<RowDataPacket[]>(
        `
       SELECT *
FROM products
WHERE id=?
LIMIT 1
FOR UPDATE
        `,
        [item.id]
      );

      if (rows.length === 0) {
        throw new Error(
          `Product ${item.id} does not exist`
        );
      }

      const product = rows[0];

      if (product.active === 0) {
        throw new Error(
          `${product.name} is unavailable`
        );
      }

      if (product.sold_out === 1) {
        throw new Error(
          `${product.name} is sold out`
        );
      }
if (
  !Number.isInteger(item.quantity) ||
  item.quantity <= 0
) {
  throw new Error(
    "Product quantity must be a positive whole number."
  );
}
      if (product.stock < item.quantity) {
        throw new Error(
          `Only ${product.stock} ${product.name} left in stock`
        );
      }


      const actualPrice =
        product.on_sale
          ? Number(product.sale_price)
          : Number(product.price);

      subtotal += actualPrice * item.quantity;

      verifiedItems.push({
        id: product.id,
        name: product.name,
        image: product.image1,
        quantity: item.quantity,
        size: item.size,
        price: actualPrice,
        remainingStock:
          product.stock - item.quantity,
      });
    }

    // Never trust browser totals: calculate the qualifying offer from the
    // database using the verified items and their server-side prices.
    const totalItems = verifiedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const [offerRows] = await connection.query<RowDataPacket[]>(
      `
        SELECT name, discount_percent
        FROM product_offers
        WHERE active = 1
          AND applies_to_all = 1
          AND min_quantity <= ?
        ORDER BY discount_percent DESC, min_quantity DESC
        LIMIT 1
      `,
      [totalItems]
    );

    const discountPercent = offerRows.length > 0
      ? Number(offerRows[0].discount_percent)
      : 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const grandTotal = subtotal - discountAmount + shipping;
    // -----------------------------
    // Create Order
    // -----------------------------

    const [orderResult] =
      await connection.query<ResultSetHeader>(
        `
        INSERT INTO orders
        (
  customer_name,
  phone,
  email,
  city,
  province,
  postal_code,
  address,
  total,
  payment_method,
  delivery_method,
  customer_notes,
  status
)
         VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
  customer_name,
  phone,
  email || null,
  city,
  province || null,
  postal_code || null,
  address,
  grandTotal,
  payment_method || "cod",
  delivery_method || "standard",
  notes || null,
  "Pending",
]
      );

    const orderId = orderResult.insertId;
        // -----------------------------
    // Save Order Items
    // -----------------------------

    for (const item of verifiedItems) {

      await connection.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          size,
          quantity,
          price,
          image
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.id,
          item.name,
          item.size,
          item.quantity,
          item.price,
          item.image,
        ]
      );

      // -----------------------------
      // Reduce Stock
      // -----------------------------

      await connection.query(
        `
        UPDATE products
        SET stock = ?
        WHERE id = ?
        `,
        [
          item.remainingStock,
          item.id,
        ]
      );

      // -----------------------------
      // Sold Out Automatically
      // -----------------------------

      if (item.remainingStock <= 0) {

        await connection.query(
          `
          UPDATE products
          SET sold_out = 1
          WHERE id = ?
          `,
          [item.id]
        );

      }

    }

    // -----------------------------
    // Finish Transaction
    // -----------------------------
await connection.commit();

// Send confirmation email
if (email && email.trim() !== "") {
  try {
    await transporter.sendMail({
      from: `"AYRAZ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `AYRAZ Order Confirmation #${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:40px;">
          <h1>Thank you for shopping with AYRAZ 🖤</h1>

          <p>Hi <strong>${customer_name}</strong>,</p>

          <p>Your order has been placed successfully.</p>

          <hr style="border-color:#444;margin:25px 0;" />

          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Total:</strong> PKR ${grandTotal.toLocaleString()}</p>
          <p><strong>Payment:</strong> Cash on Delivery</p>
          <p><strong>Status:</strong> Pending</p>

          <hr style="border-color:#444;margin:25px 0;" />

          <p>We will contact you shortly to confirm your order.</p>

          <br>

          <h2>AYRAZ</h2>
          <p>Premium Pakistani Streetwear</p>
        </div>
      `,
    });
  } catch (mailError) {
    console.error("Email Error:", mailError);
  }
}

return NextResponse.json({
  success: true,
  orderId,
});
  } catch (error: any) {

    await connection.rollback();

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Server Error",
      },
      {
        status: 500,
      }
    );

  } finally {

    connection.release();

  }
}
