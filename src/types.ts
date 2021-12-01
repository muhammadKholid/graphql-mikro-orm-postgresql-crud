import { IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";
import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Session {
      userId?: any;
    }
  }
}

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Express.Session };
  res: Response;
};
