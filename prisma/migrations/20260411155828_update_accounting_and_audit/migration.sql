-- AlterTable
ALTER TABLE "CurrencyRate" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "symbol" TEXT;

-- AlterTable
ALTER TABLE "ProductInventory" ADD COLUMN     "currency" TEXT DEFAULT 'YER';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "commissionAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
ADD COLUMN     "netAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
