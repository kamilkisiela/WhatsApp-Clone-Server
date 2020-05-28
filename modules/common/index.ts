import { createModule } from 'graphql-modules';
import { gql } from 'apollo-server-express';
import { DateTimeResolver, URLResolver } from 'graphql-scalars';
import { Resolvers } from '../../types/graphql';

const typeDefs = gql`
  scalar DateTime
  scalar URL

  type Query {
    _dummy: Boolean
  }

  type Mutation {
    _dummy: Boolean
  }

  type Subscription {
    _dummy: Boolean
  }
`;

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
};

export default createModule({
  id: 'common',
  typeDefs,
  resolvers,
  dirname: __dirname,
});
