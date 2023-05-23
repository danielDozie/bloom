import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let changeEmailResolver: FieldResolver<
  'Mutation',
  'changeEmail'
> = async (_, { username, newEmail }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  const url = `users/${username}/preferences/email.json`;
  try {
    await context.client.put(url, { email: newEmail }, config);
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let changeEmailMutation = mutationField('changeEmail', {
  type: 'String',
  args: {
    newEmail: stringArg({ required: true }),
    username: stringArg({ required: true }),
  },
  resolve: changeEmailResolver,
});
