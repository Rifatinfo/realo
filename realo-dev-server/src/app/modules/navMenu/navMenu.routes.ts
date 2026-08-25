import { NextFunction, Request, Response, Router } from "express";
import { UserRole } from "@prisma/client";

import auth from "../../middlewares/auth";
import { NavMenuController } from "./navMenu.controller";
import { NavMenuValidation } from "./navMenu.validation";

const router = Router();

const validate =
  (schema: (typeof NavMenuValidation)[keyof typeof NavMenuValidation]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

/** Navigation is site chrome, so only admins may rewrite it. */
const canManage = auth(UserRole.ADMIN);

// ---- Storefront: the header reads this on every page load ------------------
router.get("/public/:slug", NavMenuController.getMenu);

// ---- Dashboard -------------------------------------------------------------
router.get("/categories", canManage, NavMenuController.listCategoryOptions);
router.get("/:slug", canManage, NavMenuController.getMenu);
router.put(
  "/:slug",
  canManage,
  validate(NavMenuValidation.saveMenuSchema),
  NavMenuController.saveMenu,
);

export const NavMenuRoutes = router;
