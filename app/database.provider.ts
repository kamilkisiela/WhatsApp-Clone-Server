import { Injectable, Scope, OnDestroy } from 'graphql-modules';
import { Pool, PoolClient, QueryResult } from 'pg';
import { SQLStatement } from 'sql-template-strings';
import Dataloader from 'dataloader';

@Injectable({
  scope: Scope.Operation,
})
export class Database implements OnDestroy {
  private instance: PoolClient;
  private loader: Dataloader<string | SQLStatement, QueryResult>;

  constructor(private pool: Pool) {
    this.loader = new Dataloader(
      (queries) =>
        Promise.all(
          queries.map(async (query) => {
            const db = await this.getClient();
            return db.query(query);
          })
        ),
      {
        cacheKeyFn: (key: string | SQLStatement) => {
          let id: string;

          if (typeof key === 'string') {
            id = key;
          } else {
            id = key.text + ' - ' + JSON.stringify(key.values);
          }

          return id;
        },
        batch: false,
      }
    );
  }

  onDestroy() {
    if (this.instance) {
      this.instance.release();
    }
  }

  private async getClient() {
    if (!this.instance) {
      this.instance = await this.pool.connect();
    }

    return this.instance;
  }

  query(query: SQLStatement | string) {
    return this.loader.load(query);
  }
}
