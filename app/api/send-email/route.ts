import { NextResponse } from "next/server";
import transporter from "@/app/lib/mail";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    await transporter.sendMail({
      from: `"AYRAZ" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: "Your AYRAZ Order is Confirmed ",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#111;color:#fff">
          <h1>Thank you for your order!</h1>

          <p>Hello ${body.name},</p>

          <p>Your AYRAZ order has been received successfully.</p>

          <h3>Order Summary</h3>

          <p><strong>Order ID:</strong> ${body.orderId}</p>
          <p><strong>Total:</strong> PKR ${body.total}</p>

          <br>

          <p>We'll dispatch your order within 24 hours.</p>

          <h2>AYRAZ</h2>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to send email",
      },
      {
        status: 500,
      }
    );
  }
}