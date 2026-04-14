import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. جلب كافة المنتجات في المخزن
export async function GET() {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId; // 👈 التعديل الجراحي

  if (!tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const products = await prisma.productInventory.findMany({
      where: { tenantId: tenantId }, // 👈 التعديل الجراحي
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب المخزون" }, { status: 500 });
  }
}

// 2. إضافة منتج جديد للمستودع
export async function POST(req: Request) {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId; // 👈 التعديل الجراحي

  if (!tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
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
    } = body;

    const newProduct = await prisma.productInventory.create({
      data: {
        productName: name,
        externalId: sku || `PRD-${Date.now()}`,
        sku: sku || null,
        category: category || null,
        costPrice: parseFloat(buyPrice),
        buyPrice: parseFloat(buyPrice) || null,
        sellPrice: parseFloat(sellPrice) || null,
        costCurrency: "SAR",
        initialStock: parseInt(quantity),
        currentStock: parseInt(quantity),
        quantity: parseInt(quantity) || null,
        minQuantity: parseInt(minQuantity) || 5,
        supplierName: supplierName || null,
        alertOnExpiry: false,
        tenantId: tenantId, // 👈 التعديل الجراحي
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("خطأ في إضافة المنتج:", error);
    return NextResponse.json({ error: "فشل إضافة المنتج" }, { status: 500 });
  }
}
