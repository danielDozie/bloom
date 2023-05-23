import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  CustomHeader,
  LoadingOrError,
  Markdown,
  PostList,
  ShowImageModal,
} from '../components';
import { DEFAULT_CHANNEL } from '../constants';
import { Avatar, Button, Text } from '../core-ui';
import { TopicsSortEnum } from '../generated/server/types';
import {
  anchorToMarkdown,
  errorHandler,
  getImage,
  useStorage,
} from '../helpers';
import { useActivity, useProfile, useTopicList } from '../hooks';
import { makeStyles } from '../theme';
import { Post, StackNavProp, StackRouteProp } from '../types';

export default function UserInformation() {
  const styles = useStyles();

  const { navigate } = useNavigation<StackNavProp<'UserInformation'>>();

  const {
    params: { username },
  } = useRoute<StackRouteProp<'UserInformation'>>();

  const storage = useStorage();
  const channels = storage.getItem('channels');
  const currentUser = storage.getItem('user')?.username;

  const [show, setShow] = useState<boolean>();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useProfile(
    {
      variables: { username },
    },
    'HIDE_ALERT',
  );

  const name = profileData?.userProfile.user.name || '';
  const userImage = getImage(profileData?.userProfile.user.avatar || '', 'xl');
  const bio = profileData?.userProfile.user.bioRaw;
  const splittedBio = bio ? bio.split(/\r\n|\r|\n/) : [''];

  const {
    data: topicsData,
    loading: topicsLoading,
    error: topicsError,
  } = useTopicList({
    variables: { sort: TopicsSortEnum.Latest },
    fetchPolicy: 'network-only',
  });

  const { data, loading, error, networkStatus, refetch, fetchMore } =
    useActivity({ variables: { username: username, offset: 0 } }, 'HIDE_ALERT');

  const activities = data?.userActivity ?? [];
  let postActivities: Array<Post> = activities.map((activity) => {
    const channel = channels?.find(
      (channel) => channel.id === activity.categoryId,
    );
    let topic;
    const listedTopics = topicsData?.topics.topicList;
    if (listedTopics?.topics) {
      topic = listedTopics.topics.find(
        (topic) => topic.id === activity.topicId,
      );
    }
    const { content, imageUrl, mentionedUsers } = anchorToMarkdown(
      activity.excerpt,
    );

    return {
      ...activity,
      id: activity.postId ?? 0,
      content,
      images: imageUrl ? [imageUrl] : undefined,
      avatar: getImage(activity.avatarTemplate),
      viewCount: 0,
      replyCount: 0,
      likeCount: 0,
      isLiked: activity.actionType === 1,
      channel: channel || DEFAULT_CHANNEL,
      tags: topic?.tags || [],
      freqPosters: [],
      mentionedUsers,
    };
  });

  const onEndReached = (distanceFromEnd: number) => {
    if (distanceFromEnd === 0) {
      return;
    }
    fetchMore({ variables: { offset: postActivities.length } });
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const onPressCancel = () => {
    if (!show) {
      setShow(true);
    }
    setTimeout(() => setShow(false), 50);
  };

  const onPressNewMessage = () => {
    navigate('NewMessage', {
      users: [username],
      listOfUser: [{ name, username, avatar: userImage }],
    });
  };

  if (error || topicsError || profileError) {
    let errorMessage = error
      ? errorHandler(error, true)
      : topicsError
      ? errorHandler(topicsError, true)
      : profileError
      ? errorHandler(profileError, true)
      : undefined;
    return <LoadingOrError message={errorMessage} />;
  }

  if (
    ((loading ||
      topicsLoading ||
      profileLoading ||
      (data && data.userActivity.length !== 0)) &&
      postActivities.length < 1) ||
    topicsData?.topics.topicList?.topics?.length === undefined
  ) {
    return <LoadingOrError loading />;
  }

  const Header = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <CustomHeader title="" noShadow />
          <Avatar
            src={userImage}
            size="l"
            label={username[0]}
            onPress={() => {
              setShow(true);
            }}
          />
          <View style={styles.usernameText}>
            <Text variant="semiBold" size="l">
              {username}
            </Text>
          </View>
          <Markdown
            content={
              splittedBio
                ? splittedBio.length > 3
                  ? `${splittedBio.slice(0, 3).join('\n')}...`
                  : bio
                  ? bio
                  : ''
                : ''
            }
            style={styles.bioContainer}
          />
          <View style={styles.buttonContainer}>
            {currentUser !== username && (
              <Button content={t('Message')} onPress={onPressNewMessage} />
            )}
            {
              // TODO: This LoC is meant for the next phase
              /* <View style={styles.buttonDivider} /> 
        <Button
          content={t('Badges')}
          style={styles.whiteButton}
          textColor="textNormal"
          disabled
        /> */
            }
          </View>
        </View>
        <Text variant={'semiBold'} style={styles.activityText}>
          {t('Activity')}
        </Text>
      </>
    );
  };

  let content;
  if (postActivities.length !== 0) {
    content = (
      <PostList
        ListHeaderComponent={<Header />}
        data={postActivities}
        showLabel={true}
        currentUser={username}
        onRefresh={onRefresh}
        refreshing={networkStatus === 4 || refreshing}
        scrollEventThrottle={16}
        alwaysBounceVertical={true}
        hasFooter={false}
        style={styles.fill}
        showImageRow
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => onEndReached(distanceFromEnd)}
      />
    );
  } else {
    content = (
      <View style={styles.noActivity}>
        <Header />
        <Text style={styles.noActivityText}>
          {t("This user doesn't have any activity")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      {show && (
        <ShowImageModal
          show={show}
          userImage={{ uri: userImage }}
          onPressCancel={onPressCancel}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  usernameText: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.s,
  },
  bioContainer: {
    paddingHorizontal: spacing.xxl,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: spacing.xl,
  },
  // TODO: This LoC is meant for the next phase
  // buttonDivider: {
  //   paddingRight: spacing.l,
  // },
  // whiteButton: {
  //   backgroundColor: colors.background,
  //   borderWidth: 1,
  //   borderColor: colors.border,
  // },
  activityText: {
    paddingLeft: spacing.xl,
    paddingVertical: spacing.xl,
  },
  fill: {
    width: '100%',
    flexGrow: 1,
  },
  noActivity: {
    width: '100%',
  },
  noActivityText: {
    alignSelf: 'center',
  },
}));
