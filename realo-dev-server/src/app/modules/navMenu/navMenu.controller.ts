import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NavMenuService } from "./navMenu.service";

const ok = (res: Response, message: string, data: unknown) =>
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message,
    data,
  });

const getMenu = catchAsync(async (req: Request, res: Response) => {
  ok(res, "Menu fetched", await NavMenuService.getMenu(req.params.slug));
});

const saveMenu = catchAsync(async (req: Request, res: Response) => {
  ok(res, "Menu saved", await NavMenuService.saveMenu(req.params.slug, req.body));
});

const listCategoryOptions = catchAsync(async (_req: Request, res: Response) => {
  ok(res, "Categories fetched", await NavMenuService.listCategoryOptions());
});

export const NavMenuController = {
  getMenu,
  saveMenu,
  listCategoryOptions,
};
