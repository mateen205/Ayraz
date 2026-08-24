import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { verifyAdminSession } from "@/app/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(req: NextRequest) {
  try {
    // ================================
    // ADMIN AUTHENTICATION
    // ================================

    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const session = await verifyAdminSession(token);

    if (!session) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );

      response.cookies.delete("admin_session");

      return response;
    }

    // ================================
    // READ UPLOAD
    // ================================

    const data = await req.formData();

    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded.",
        },
        { status: 400 }
      );
    }

    // ================================
    // FILE SIZE
    // ================================

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "File is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File is too large. Maximum size is 5 MB.",
        },
        { status: 413 }
      );
    }

    // ================================
    // FILE TYPE
    // ================================

    const extension = ALLOWED_TYPES.get(file.type);

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, and WebP images are allowed.",
        },
        { status: 415 }
      );
    }

    // ================================
    // SAFE SERVER-GENERATED FILENAME
    // ================================

    const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filepath = path.join(
      process.cwd(),
      "public",
      "images",
      "products",
      filename
    );

    // ================================
    // SAVE FILE
    // ================================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      path: `/images/products/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}