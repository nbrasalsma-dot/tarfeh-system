-- AlterTable
ALTER TABLE "SystemConfig" ADD COLUMN     "address" TEXT,
ADD COLUMN     "commercialRegister" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'YER',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phone2" TEXT,
ADD COLUMN     "storeNameAr" TEXT NOT NULL DEFAULT 'ترفة للكماليات',
ADD COLUMN     "storeNameEn" TEXT,
ADD COLUMN     "taxNumber" TEXT,
ADD COLUMN     "taxPercentage" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "website" TEXT;
