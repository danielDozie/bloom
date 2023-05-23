import React, { RefObject } from 'react';
import {
  Dimensions,
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputFocusEventData,
  View,
  ViewProps,
} from 'react-native';

import { MentionedText, TextInputType } from '../core-ui';
import { makeStyles, useTheme } from '../theme';
import { CursorPosition } from '../types';

const screen = Dimensions.get('screen');

type Props = ViewProps & {
  value: string;
  placeholder?: string;
  large?: boolean;
  onChangeValue: (value: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSelectedChange: (cursor: CursorPosition) => void;
  inputRef?: RefObject<TextInputType>;
  mentionToggled?: boolean;
  isKeyboardShow: boolean;
};

export function TextArea(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    value,
    placeholder,
    large,
    onChangeValue,
    onFocus,
    onSelectedChange,
    inputRef,
    mentionToggled,
    isKeyboardShow,
    onBlur,
    ...otherProps
  } = props;

  const ios = Platform.OS === 'ios';

  // Normal variant used in NewPost and NewMessaage
  // Large variant used in PostReply
  const NORMAL_IOS_VIEW_SIZE = screen.height * 0.24;
  const LARGE_IOS_VIEW_SIZE = screen.height * 0.4;
  const IOS_VIEW_SIZE = large ? LARGE_IOS_VIEW_SIZE : NORMAL_IOS_VIEW_SIZE;

  const MENTION_TEXT_AREA_VIEW_SIZE = 200;

  const DEFAULT_TEXT_AREA_VIEW_SIZE = 500;

  return (
    <View {...otherProps}>
      <View
        style={
          ios
            ? isKeyboardShow
              ? styles.contentContainerWithKeyboard
              : mentionToggled
              ? styles.contentContainerWithMention
              : styles.contentContainer
            : styles.contentContainer
        }
      >
        <TextInput
          ref={inputRef}
          onSelectionChange={(cursor) => {
            onSelectedChange(cursor.nativeEvent.selection);
          }}
          onChangeText={(value) => onChangeValue(value)}
          style={
            ios
              ? [
                  styles.textInput,
                  {
                    height: isKeyboardShow
                      ? IOS_VIEW_SIZE
                      : mentionToggled
                      ? MENTION_TEXT_AREA_VIEW_SIZE
                      : DEFAULT_TEXT_AREA_VIEW_SIZE,
                  },
                ]
              : [
                  styles.textInput,
                  !isKeyboardShow && {
                    height: DEFAULT_TEXT_AREA_VIEW_SIZE,
                  },
                ]
          }
          multiline
          autoCorrect={false}
          autoCapitalize="sentences"
          placeholder={placeholder}
          placeholderTextColor={colors.darkTextLighter}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <MentionedText textValue={value} />
        </TextInput>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  contentContainer: {
    height: 500,
    paddingTop: spacing.xl,
  },
  contentContainerWithMention: {
    height: 160,
    paddingTop: spacing.xl,
  },
  contentContainerWithKeyboard: {
    height: 200,
    paddingTop: spacing.xl,
  },
  textInput: {
    color: colors.textNormal,
    fontSize: fontSizes.m,
    textAlignVertical: 'top',
  },
}));
