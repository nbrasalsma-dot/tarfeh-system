-- AlterTable
ALTER TABLE "ProductInventory" ADD COLUMN     "buyPrice" DECIMAL(65,30),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "minQuantity" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "sellPrice" DECIMAL(65,30),
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "supplierName" TEXT;
