import { IPaginated } from "src/shared/shared.interface";
import { User } from "../user/schemas/user.schema";
export interface IFinanceSymbol {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  isin: string | null;
  mic: string;
  shareClassFIGI: string;
  symbol: string;
  symbol2: string;
  type: string;
}

export interface IFinanceWatchSymbol {
  symbol: IFinanceSymbol;
  price: number;
  direction: string;
}

export interface IFinanceService {
  name: string;

  getStockSymbols(
    limit: number,
    page: number
  ): Promise<IPaginated<IFinanceSymbol>>;

  getStockCandles(
    symbol: string,
    resolution: string,
    from: number,
    to: number
  ): Promise<any>;

  addSymbolToWatchlist(
    symbol: string,
    user: User,
    price: number,
    direction: string
  ): void;

  getSymbolWatchlist(
    user: User,
    limit: number,
    page: number
  ): Promise<IPaginated<IFinanceWatchSymbol>>;

  removeSymbolFromWatchlist(id: string, user : User): void;
  getStockSymbol(symbol: string): Promise<IFinanceSymbol>;
  getSymbolWatchlistBySymbol(user: User, symbol: string): Promise<IFinanceWatchSymbol[]>;
}
