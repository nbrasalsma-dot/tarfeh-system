import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. جلب منتج واحد
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId; // 👈 التعديل الجراحي

  if (!tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    // ✅ فك Promise params
    const { id } = await params;

    const product = await prisma.productInventory.findFirst({
      where: {
        id: id,
        tenantId: tenantId, // 👈 التعديل الجراحي
      },
    });

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب المنتج" }, { status: 500 });
  }
}

// 2. تحديث منتج (تعديل)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId; // 👈 التعديل الجراحي

  if (!tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    // ✅ فك Promise params
    const { id } = await params;

    const body = await req.json();
    const {
      name,
      sku,
      category,
      quantity,
      buyPrice,
      sellPrice,
      minQuantity,
      supplierName,
      currency,
    } = body;

    // التحقق من وجود المنتج
    const existingProduct = await prisma.productInventory.findFirst({
      where: {
        id: id,
        tenantId: tenantId, // 👈 التعديل الجراحي
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // تحديث المنتج
    const updatedProduct = await prisma.productInventory.update({
      where: { id: id },
      data: {
        productName: name,
        sku: sku || null,
        category: category || null,
        quantity: parseInt(quantity),
        currentStock: parseInt(quantity), // تحديث المخزون الحالي
        buyPrice: parseFloat(buyPrice) || null,
        costPrice: parseFloat(buyPrice) || existingProduct.costPrice,
        sellPrice: parseFloat(sellPrice) || null,
        minQuantity: parseInt(minQuantity) || 5,
        supplierName: supplierName || null,
        currency: currency || "YER", // ✅ بعد إضافة الحقل في schema.prisma
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("خطأ في تحديث المنتج:", error);
    return NextResponse.json({ error: "فشل تحديث المنتج" }, { status: 500 });
  }
}

// 3. حذف منتج
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId; // 👈 التعديل الجراحي

  if (!tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    // ✅ فك Promise params
    const { id } = await params;

    // التحقق من وجود المنتج
    const existingProduct = await prisma.productInventory.findFirst({
      where: {
        id: id,
        tenantId: tenantId, // 👈 التعديل الجراحي
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // حذف المنتج
    await prisma.productInventory.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("خطأ في حذف المنتج:", error);
    return NextResponse.json({ error: "فشل حذف المنتج" }, { status: 500 });
  }
}
