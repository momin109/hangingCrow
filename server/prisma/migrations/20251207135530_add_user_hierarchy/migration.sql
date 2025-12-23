-- CreateTable
CREATE TABLE "UserHierarchy" (
    "ancestor_id" TEXT NOT NULL,
    "descendant_id" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,

    CONSTRAINT "UserHierarchy_pkey" PRIMARY KEY ("ancestor_id","descendant_id")
);

-- CreateIndex
CREATE INDEX "UserHierarchy_ancestor_id_idx" ON "UserHierarchy"("ancestor_id");

-- CreateIndex
CREATE INDEX "UserHierarchy_descendant_id_idx" ON "UserHierarchy"("descendant_id");

-- AddForeignKey
ALTER TABLE "UserHierarchy" ADD CONSTRAINT "UserHierarchy_ancestor_id_fkey" FOREIGN KEY ("ancestor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHierarchy" ADD CONSTRAINT "UserHierarchy_descendant_id_fkey" FOREIGN KEY ("descendant_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
