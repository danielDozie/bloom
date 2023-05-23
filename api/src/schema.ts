import * as path from 'path';

import { makeSchema } from '@nexus/schema';

import * as Resolvers from './resolvers';
import * as Scalars from './scalars';
import * as Types from './typeSchemas';

let schema = makeSchema({
  types: [Resolvers, Types, Scalars],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: path.join(
      __dirname,
      '../node_modules/@types/nexus-typegen/index.d.ts',
    ),
  },
});

export { schema };
