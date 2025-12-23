-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "fancy_id" INTEGER,
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "new_market_id" INTEGER;

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "provider_match_id" TEXT,
    "sport" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "market_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "odds" JSONB,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fancy" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(19,4) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionLedger" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "type" TEXT NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "match_id" INTEGER NOT NULL,
    "market_id" INTEGER,
    "result_data" JSONB NOT NULL,
    "declared_by" TEXT,
    "declared_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskReport" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bet_id" TEXT,
    "reason" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_start_time_idx" ON "Match"("start_time");

-- CreateIndex
CREATE INDEX "Market_match_id_idx" ON "Market"("match_id");

-- CreateIndex
CREATE INDEX "Market_status_idx" ON "Market"("status");

-- CreateIndex
CREATE INDEX "Fancy_match_id_idx" ON "Fancy"("match_id");

-- CreateIndex
CREATE INDEX "Fancy_status_idx" ON "Fancy"("status");

-- CreateIndex
CREATE INDEX "Payment_user_id_idx" ON "Payment"("user_id");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "CommissionLedger_user_id_idx" ON "CommissionLedger"("user_id");

-- CreateIndex
CREATE INDEX "CommissionLedger_created_at_idx" ON "CommissionLedger"("created_at");

-- CreateIndex
CREATE INDEX "Result_match_id_idx" ON "Result"("match_id");

-- CreateIndex
CREATE INDEX "Result_market_id_idx" ON "Result"("market_id");

-- CreateIndex
CREATE INDEX "RiskReport_user_id_idx" ON "RiskReport"("user_id");

-- CreateIndex
CREATE INDEX "RiskReport_score_idx" ON "RiskReport"("score");

-- CreateIndex
CREATE INDEX "RiskReport_created_at_idx" ON "RiskReport"("created_at");

-- CreateIndex
CREATE INDEX "Bet_new_market_id_idx" ON "Bet"("new_market_id");

-- CreateIndex
CREATE INDEX "Bet_fancy_id_idx" ON "Bet"("fancy_id");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_new_market_id_fkey" FOREIGN KEY ("new_market_id") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_fancy_id_fkey" FOREIGN KEY ("fancy_id") REFERENCES "Fancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fancy" ADD CONSTRAINT "Fancy_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
