import { FieldResolver, queryField, intArg } from '@nexus/schema';

import { ACCEPTED_LANGUAGE } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

import { postQueryResolver } from './postQuery';

let replyingToQueryResolver: FieldResolver<'Query', 'replyingTo'> = async (
  _,
  { postId },
  context: Context,
  info,
) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
    },
    params: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      max_replies: 1,
    },
  };
  try {
    let url = `/posts/${postId}/reply-history.json`;
    let { data: postResult } = await context.client.get(url, config);

    if (postResult[0]) {
      // They actually have data here but without raw and we can't use include_raw: true so we fetch it again with post.
      let post = await postQueryResolver(
        _,
        { postId: postResult[0].id },
        context,
        info,
      );
      return post;
    } else {
      throw new Error('This post is not replying to other post.');
    }
  } catch (error) {
    throw errorHandler(error);
  }
};

let replyingToQuery = queryField('replyingTo', {
  type: 'Post',
  args: {
    postId: intArg({ required: true }),
  },
  resolve: replyingToQueryResolver,
});

export { replyingToQuery };
