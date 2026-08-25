-- CreateEnum
CREATE TYPE "NavMenuItemKind" AS ENUM ('CUSTOM', 'PAGE', 'CATEGORY');

-- CreateTable
CREATE TABLE "nav_menus" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nav_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_menu_items" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "kind" "NavMenuItemKind" NOT NULL DEFAULT 'CUSTOM',
    "categoryId" TEXT,
    "parentId" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "openInNewTab" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "nav_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nav_menus_slug_key" ON "nav_menus"("slug");

-- CreateIndex
CREATE INDEX "nav_menu_items_menuId_idx" ON "nav_menu_items"("menuId");

-- CreateIndex
CREATE INDEX "nav_menu_items_parentId_idx" ON "nav_menu_items"("parentId");

-- AddForeignKey
ALTER TABLE "nav_menu_items" ADD CONSTRAINT "nav_menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "nav_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nav_menu_items" ADD CONSTRAINT "nav_menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "nav_menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

