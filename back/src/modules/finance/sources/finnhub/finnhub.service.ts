import { Injectable } from "@nestjs/common";
import {
  IFinanceService,
  IFinanceSymbol,
  IFinanceWatchSymbol,
} from "../../finance.interface";
import { ConfigService } from "@nestjs/config";
import { Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Symbol, SymbolDocument } from "../../schemas/symbol.schema";
import {
  UserSymbolWatch,
  UserSymbolWatchDocument,
} from "../../schemas/userSymbolWatch";
import { WebSocket } from "ws";
import {
  LastChange,
  LastChangeDocument,
} from "../../schemas/lastChange.schema";
import { IPaginated } from "../../../../shared/shared.interface";
import { UserEmailNotificationModule } from "src/modules/user/user.email.service";

@Injectable()
export class FinnHubService implements IFinanceService {
  private _apiKey: string;
  private _url: string;
  private _ws: WebSocket;

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @InjectModel(Symbol.name) private symbolModel: Model<SymbolDocument>,
    @InjectModel(UserSymbolWatch.name)
    private symbolWatchModel: Model<UserSymbolWatchDocument>,
    @InjectModel(LastChange.name)
    private lastChangeModel: Model<LastChangeDocument>,
    @Inject(UserEmailNotificationModule)
    private userService: UserEmailNotificationModule
  ) {
    this._apiKey = configService.get<string>("financeCreds");
    this._url = "https://finnhub.io/api/v1/";
    this._ws = new WebSocket("wss://ws.finnhub.io?token=" + this._apiKey);
    this.connectToWS(this._ws, this.symbolWatchModel, this);
  }

  name = "FinnHubService";

  private connectToWS(
    ws: WebSocket,
    symbolWatchModel: Model<UserSymbolWatchDocument>,
    obj: FinnHubService
  ) {
    ws.on("open", function open() {
      console.log("connected");
      symbolWatchModel.find().then((watches) => {
        watches.forEach((watch) => {
          console.log("subscribing to " + watch.symbol);
          ws.send(
            JSON.stringify({
              type: "subscribe",
              symbol: watch.symbol,
            })
          );
        });
      });
    });
    ws.on("close", function close() {
      console.log("disconnected");
    });
    ws.on("message", function incoming(data) {
      obj.handleMessages(data);
    });
    ws.on("error", function error(data) {
      console.log(data);
    });
  }

  private async handleMessages(data: any) {
    const parsed = JSON.parse(data);
    console.log(parsed);
    if (parsed.type === "trade") {
      const symbol = parsed.data[0].s;
      const price = parsed.data[0].p;
      const watches = await this.symbolWatchModel.find({ symbol: symbol });
      watches.forEach((watch) => {
        if (
          (watch.direction === "above" && price > watch.price) ||
          (watch.direction === "below" && price < watch.price)
        ) {
          console.log("triggered");
          this.userService.sendEmail(watch.user.email, {
            symbol: symbol,
            price: price,
            direction: watch.direction,
          });
        }
      });
    }
    if (parsed.type === "ping") {
      this._ws.send(JSON.stringify({ type: "pong" }));
    }
  }

  async getStockCandles(
    symbol: string,
    resolution: string,
    from: number,
    to: number
  ): Promise<any> {
    const response = await fetch(
      `${this._url}stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
      {
        headers: {
          "X-Finnhub-Token": this._apiKey,
        },
      }
    );
    const data = await response.json();
    if (data.s === "no_data") {
      return [];
    }
    if ("error" in data) {
      throw new Error(data.error);
    }
    return data;
  }

  async getStockSymbols(
    limit: number = 10,
    page: number = 1
  ): Promise<IPaginated<IFinanceSymbol>> {
    const lastChange = await this.lastChangeModel
      .findOne({ collectionName: Symbol.name })
      .sort({ stamp: -1 })
      .exec();
    const count = await this.symbolModel.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    if (
      !lastChange ||
      (lastChange &&
        lastChange.stamp < new Date(Date.now() - 1000 * 60 * 60 * 24))
    ) {
      this.updateSymbols();
      if (lastChange) {
        const data = await this.symbolModel
          .find()
          .limit(limit)
          .skip((page - 1) * limit)
          .exec();
        return {
          data,
          total: count,
          page,
          limit,
          totalPages: page_total,
        };
      }
    }
    const data = await this.symbolModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: page_total,
    };
  }

  public async addSymbolToWatchlist(
    symbol: string,
    user: any,
    price: number,
    direction: string
  ): Promise<void> {
    const _symbol = await this.symbolModel.findOne({ symbol: symbol }).exec();
    if (!_symbol) {
      throw new Error("Symbol not found");
    }
    console.log(user);
    const watch = await this.symbolWatchModel
      .findOne({
        symbol: symbol,
        uid: user.uid,
        price: price,
        direction: direction,
      })
      .exec();
    if (!watch) {
      await this.symbolWatchModel.create({
        symbol: symbol,
        uid: user.uid,
        user,
        price: price,
        direction: direction,
      });
      this._ws.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
    }
  }

  private async updateSymbols() {
    const response = await fetch(
      "https://finnhub.io/api/v1/stock/symbol?exchange=US",
      {
        headers: {
          "X-Finnhub-Token": this._apiKey,
        },
      }
    );
    const symbols = await response.json().then((data) => {
      return data.map((symbol) => {
        return {
          updateOne: {
            filter: { symbol: symbol.symbol },
            update: { ...symbol },
            upsert: true,
          },
        };
      });
    });
    await this.symbolModel.bulkWrite(symbols);
    await this.lastChangeModel.create({
      collectionName: Symbol.name,
      stamp: new Date(),
    });
  }

  async getSymbolWatchlist(
    user: any,
    limit: number = 10,
    page: number = 1
  ): Promise<IPaginated<IFinanceWatchSymbol>> {
    const count = await this.symbolWatchModel
      .countDocuments({ uid: user.uid })
      .exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const watches = await this.symbolWatchModel
      .find({ uid: user.uid })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const data = await Promise.all(
      watches.map(async (watchSymbol) => {
        return {
          sid: watchSymbol._id,
          symbol: await this.symbolModel
            .findOne({ symbol: watchSymbol.symbol })
            .exec(),
          price: watchSymbol.price,
          direction: watchSymbol.direction,
        };
      })
    );
    return {
      data,
      total: count,
      page,
      limit,
      totalPages: page_total,
    };
  }

  async removeSymbolFromWatchlist(id: string, user: any): Promise<void> {
    const watch = await this.symbolWatchModel.findById(id).exec();
    if (!watch) {
      throw new Error("Symbol not found");
    }
    if (watch.uid.toString() !== user.uid.toString()) {
      throw new Error("Unauthorized");
    }
    const result = await this.symbolWatchModel
      .deleteOne({ _id: id, uid: user.uid })
      .exec();
    if (result.deletedCount > 1) {
      this._ws.send(
        JSON.stringify({ type: "unsubscribe", symbol: watch.symbol })
      );
    }
  }
}
