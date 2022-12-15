import { useState, useEffect } from 'react';
import { ellipsisString } from 'src/utils';
import { addUserComments, Comment, fetchComments, fetchMoreComments } from 'src/utils/firestore/firestoreUtils';
import { format } from 'timeago.js';
import { Button, Drawer, EZImage, NextLink, ScrollLoader } from 'src/components/common';
import { NftEventRec } from '../asset/activity/activity-item';
import { UserInfoCache } from './user-info-cache';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: NftEventRec;
  contentOnly?: boolean;
}

export const CommentPanel = ({ isOpen, onClose, event, contentOnly }: Props) => {
  const { user, checkSignedIn } = useOnboardContext();

  const [text, setText] = useState('');
  const [data, setData] = useState<Comment[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [trigger, setTrigger] = useState<number>(0);

  const fetchData = async (more: boolean) => {
    const commentsArr = more ? fetchMoreComments(event.id) : await fetchComments(event.id);
    setData(commentsArr as Comment[]);

    setIsFetched(true);
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  const onCacheUpdate = () => {
    const t = Math.random();
    setTrigger(t);
  };

  useEffect(() => {
    UserInfoCache.emitter.on('updated', onCacheUpdate);

    return () => {
      UserInfoCache.emitter.off('updated', onCacheUpdate);
    };
  }, []);

  const onClickReply = async () => {
    if (!checkSignedIn()) {
      return;
    }

    // this is async, so text is still valid below
    // look faster and better if the text clears immediately as the call below will take time
    setText('');

    await addUserComments({
      eventId: event.id ?? '',
      userAddress: user?.address ?? '',
      username: user?.username ?? '',
      comment: text
    });
    fetchData(false);
  };

  const replyBox = (
    <div className="flex">
      <textarea
        autoFocus={true}
        rows={3}
        value={text}
        onChange={(ev) => setText(ev.target.value)}
        className="resize-none placeholder-gray-400 border-none text-lg focus:ring-0 block w-full bg-theme-light-200  rounded-2xl mb-3"
        placeholder="Enter Reply"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            onClickReply();
          }
        }}
      />

      <Button variant="outline" onClick={onClickReply} className="h-10 ml-2 font-heading">
        Reply
      </Button>
    </div>
  );

  const content = (
    <>
      {isFetched && data.length === 0 && <div>There are no comments.</div>}

      {data.map((item, idx: number) => {
        const userInfo = UserInfoCache.getUserInfoSync(item.userAddress);

        return (
          <div key={idx}>
            <hr className="mb-4 text-gray-100" />

            <div className="flex items-center">
              <EZImage
                src={
                  userInfo?.profileImage ?? 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
                }
                className="border rounded-full overflow-clip shrink-0 bg-theme-light-200 w-12 h-12"
              />
              <NextLink href={`/profile/${item.username ?? item.userAddress}`} className="ml-4 font-bold">
                {ellipsisString(item.username ?? item.userAddress)}
              </NextLink>
              <div className="ml-4" title={new Date(item.timestamp).toLocaleString()}>
                {format(item.timestamp)}
              </div>
            </div>
            <div className="ml-16 mt-1 mb-4">{item.comment}</div>
          </div>
        );
      })}
    </>
  );

  if (contentOnly) {
    return (
      <>
        {replyBox} {content}
      </>
    );
  }
  return (
    <Drawer open={isOpen} onClose={onClose} title="Comments">
      <div className="p-4">
        {replyBox}

        {content}

        <ScrollLoader
          onFetchMore={() => {
            fetchData(true);
          }}
        />
      </div>
    </Drawer>
  );
};
