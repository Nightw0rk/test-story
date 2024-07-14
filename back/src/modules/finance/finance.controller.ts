import {
  Body,
  Controller,
  Get,
  Inject,
  Delete,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { IFinanceService, IFinanceSymbol } from "./finance.interface";
import { Response } from "../../app.interface";
import { GetUser } from "../user/user.decorator";

@Controller("finance")
export class FinanceController {
  constructor(
    @Inject("IFinanceService")
    private financeService: IFinanceService
  ) {}

  @Get()
  getFinanceServiceName() {
    return this.financeService.name;
  }
  @Get("/symbols")
  async getStockSymbols(
    @Query("limit") limit: number,
    @Query("page") page: number
  ) {
    try {
      const { data, total, totalPages } =
        await this.financeService.getStockSymbols(limit, page);
      return Response.success(data, {
        page,
        total,
        totalPages,
      });
    } catch (error) {
      return Response.error(error.message, 500);
    }
  }

  @Get("/candles")
  async getStockCandles(
    @Query("symbol") symbol: string,
    @Query("resolution") resolution: string,
    @Query("from") from: number,
    @Query("to") to: number
  ) {
    try {
      const data = await this.financeService.getStockCandles(
        symbol,
        resolution,
        from,
        to
      );
      return Response.success(data);
    } catch (error) {
      return Response.error(error.message, 400);
    }
  }

  @Put("/watch/:symbol")
  async addSymbolToWatchlist(
    @GetUser() user,
    @Param("symbol") symbol: string,
    @Body()
    body: {
      price: number;
      direction: "above" | "below";
    }
  ) {
    if (!body.price) {
      return Response.error("Price is required", 400);
    }
    if (!body.direction) {
      return Response.error("Direction is required", 400);
    }
    try {
      const data = await this.financeService.addSymbolToWatchlist(
        symbol,
        user,
        body.price,
        body.direction
      );
      return Response.success(null);
    } catch (error) {
      return Response.error(error.message, 400);
    }
  }

  @Delete("/watch/:id")
  async removeSymbolFromWatchlist(@GetUser() user, @Param("id") id: string) {
    try {
      await this.financeService.removeSymbolFromWatchlist(id, user);
      return Response.success(null);
    } catch (error) {
      return Response.error(error.message, 400);
    }
  }

  @Get("/watch/my")
  async getSymbolWatchlist(
    @GetUser() user,
    @Query("limit") limit: number,
    @Query("page") page: number
  ) {
    try {
      const data = await this.financeService.getSymbolWatchlist(
        user,
        limit,
        page
      );
      return Response.success(data.data, {
        page,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      return Response.error(error.message, 400);
    }
  }
}
