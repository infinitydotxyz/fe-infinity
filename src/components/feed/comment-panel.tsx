import { useState, useEffect } from 'react';
import { ellipsisString } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { addUserComments, fetchComments, fetchMoreComments } from 'src/utils/firestore/firestoreUtils';
import { format } from 'timeago.js';
import { Button, Drawer, FetchMore } from 'src/components/common';
import { Comment, FeedEvent } from './feed-item';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: FeedEvent;
  contentOnly?: boolean;
}

export const CommentPanel = ({ isOpen, onClose, event, contentOnly }: Props) => {
  const { user, checkSignedIn } = useAppContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState('');
  const [data, setData] = useState<Comment[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  const fetchData = async () => {
    const commentsArr = await fetchComments(event.id);
    setData(commentsArr as Comment[]);
    event.comments = commentsArr.length;
    setIsFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClickReply = async () => {
    if (!checkSignedIn()) {
      return;
    }
    await addUserComments(event.id || '', user?.address ?? '', text);
    setData([]);
    setCurrentPage(0);
    void fetchData();
    setText('');
  };

  const replyBox = (
    <div className="flex ">
      <textarea
        value={text}
        placeholder="Reply here"
        onChange={(ev) => setText(ev.target.value)}
        className="mb-6 w-full text-xl  border-none"
      />
      <Button variant="outline" onClick={onClickReply} className="h-10 ml-2 font-heading text-secondary">
        Reply
      </Button>
    </div>
  );

  const content = (
    <>
      {isFetched && data.length === 0 && <div>There are no comments.</div>}

      {data.map((item, idx: number) => {
        return (
          <div key={idx}>
            <hr className="mb-8 text-gray-100" />

            <div className="flex items-center">
              <img
                alt="profile image"
                src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                className="border rounded-3xl bg-gray-100 p-5"
              />
              <div className="ml-4 font-bold">{ellipsisString(item.userAddress)}</div>
              <div className="ml-4 text-secondary" title={new Date(item.timestamp).toLocaleString()}>
                {format(item.timestamp)}
              </div>
            </div>
            <pre className="ml-14 mt-4 mb-8 font-body">{item.comment}</pre>
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

        <FetchMore
          currentPage={currentPage}
          onFetchMore={async () => {
            setCurrentPage(currentPage + 1);
            const arr = (await fetchMoreComments(event.id)) as Comment[];
            setData((currentComments) => [...currentComments, ...arr]);
          }}
        />
      </div>
    </Drawer>
  );
};
