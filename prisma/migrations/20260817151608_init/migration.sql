-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(75) NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" BIGSERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "notification" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50),
    "serialNumber" VARCHAR(75),
    "symptom" VARCHAR(100) NOT NULL,
    "actions" TEXT NOT NULL,
    "changedParts" VARCHAR(255),
    "sender" TEXT NOT NULL,
    "requestBy" TEXT NOT NULL,
    "requestByEmail" TEXT NOT NULL,
    "requestOn" TIMESTAMP(3) NOT NULL,
    "approvedBy" INTEGER,
    "approvedOn" TIMESTAMP(3),
    "receivedBy" INTEGER,
    "receivedOn" TIMESTAMP(3),
    "handledBy" INTEGER,
    "handledOn" TIMESTAMP(3),
    "actionTakenByTC" TEXT,
    "result" TEXT,
    "sentBackBy" INTEGER,
    "sendBackOn" TIMESTAMP(3),
    "awbNumber" VARCHAR(50),
    "completedBy" INTEGER,
    "completedOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Job_notification_key" ON "Job"("notification");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_handledBy_fkey" FOREIGN KEY ("handledBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_sentBackBy_fkey" FOREIGN KEY ("sentBackBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
