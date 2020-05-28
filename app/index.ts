import { createApp } from 'graphql-modules';
import { Pool } from 'pg';
const { PostgresPubSub } = require('graphql-postgres-subscriptions');

import { provideSession } from './session';
import { Database } from './database.provider';
import { PubSub } from './pubsub.provider';
import { pool } from '../db';
import commonModule from '../modules/common';
import usersModule from '../modules/users';
import chatsModule from '../modules/chats';

const pubsub = new PostgresPubSub({
  host: 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: 'testuser',
  password: 'testpassword',
  database: 'whatsapp',
});

export const app = createApp({
  modules: [commonModule, usersModule, chatsModule],
  providers: [
    {
      provide: Pool,
      useValue: pool,
    },
    {
      provide: PubSub,
      useValue: pubsub,
    },
    Database,
    ...provideSession(),
  ],
});