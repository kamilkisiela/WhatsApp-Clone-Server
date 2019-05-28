import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

import usersModule from './modules/users'
import chatsModule from './modules/chats'

export const rootModule = new GraphQLModule({
  name: 'root',
  imports: [usersModule, chatsModule]
})

export const server = new ApolloServer({
  schema: rootModule.schema,
  context: rootModule.context,
  subscriptions: rootModule.subscriptions,
  engine: {
    apiKey: 'service:whatsapp-cache-messages:EMKyD28ydXotLr8DnxkDFA'
  },
  formatError(error) {
    console.log(error.originalError);
    return error;
  }
})
