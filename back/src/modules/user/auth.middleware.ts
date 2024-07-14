import { Injectable, NestMiddleware } from "@nestjs/common";
import admin from "firebase-admin";
import * as path from "path";

const serviceAccount = require(
  path.resolve("./serviceAccount.json")
);

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private defaultApp: admin.app.App;

  constructor() {
    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  use(req: any, res: any, next: () => void) {
    if (req.method === "OPTIONS" || req.method === "HEAD") {
      next()
      return
    }
    if (!req.headers.authorization) {
      res.status(401).send("Unauthorized");
      return;
    }
    const [ _, token] = req.headers.authorization.split(" ");
    if (token) {
      this.defaultApp
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          req.user = decodedToken;
          next();
        })
        .catch((error) => {
          console.log(error)
          res.status(401).send("Unauthorized");
        });
    } else {
      res.status(401).send("Unauthorized");
    }
  }
}
