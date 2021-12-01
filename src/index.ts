import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { PostResolvers } from "./resolvers/post";
import { HelloResolvers } from "./resolvers/hello";
import { UserResolvers } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "_sid",
      store: new RedisStore({
        client: redisClient,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookies only work in https
      },
      saveUninitialized: false,
      secret: "qwaszx",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolvers, PostResolvers, HelloResolvers],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.listen(8080, () => {
    console.log("Listening on port : 8080");
  });
  // const post = orm.em.create(Post, { title: "My first post." });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.log("errorrrr", err);
});
