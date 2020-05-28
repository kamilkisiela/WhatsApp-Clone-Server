import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import cookie from 'cookie';
import { Express } from 'express';
import { Server } from 'http';
import { app } from './app';

const execute = app.createExecution();
const subscribe = app.createSubscription();

const apollo = new ApolloServer({
  schema: app.schema,
  executeFn: execute,
  subscribeFn: subscribe,
  context: (session: any) => {
    if (session.connection) {
      session.req = session.connection.context.req;
      const cookies = session.req.headers.cookie;

      if (cookies) {
        session.req.cookies = cookie.parse(cookies);
      }
    }

    return {
      request: session.req,
      response: session.res,
    };
  },
  subscriptions: {
    onConnect: (_connectionParams, _webSocket, connectionContext) => {
      return { req: connectionContext.request };
    },
  },
});

export function useGraphQL({ app, server }: { app: Express; server: Server }) {
  apollo.applyMiddleware({
    app,
    path: '/graphql',
  });
  apollo.installSubscriptionHandlers(server);
}
