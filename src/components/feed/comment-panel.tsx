import { useState, useEffect } from 'react';
import { ellipsisString } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { addUserComments, fetchComments, fetchMoreComments } from 'src/utils/firestore/firestoreUtils';
import { format } from 'timeago.js';
import { Button, FetchMore } from '../common';
import { Drawer } from '../common/drawer';
import { Comment, FeedEvent } from './feed-item';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: FeedEvent;
}

export function CommentPanel({ isOpen, onClose, event }: Props) {
  const { user } = useAppContext();
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

  return (
    <Drawer open={isOpen} onClose={onClose} title="Comments">
      <div className="p-4">
        <div className="flex">
          <textarea onChange={(ev) => setText(ev.target.value)} className="mb-6 w-full" />
          <Button
            variant="outline"
            onClick={async () => {
              await addUserComments(event.id || '', user?.address ?? '', text);
              setData([]);
              setCurrentPage(0);
              fetchData();
              setText('');
            }}
            className="h-10 ml-2"
          >
            Submit
          </Button>
        </div>

        {isFetched && data.length === 0 && <div>There are no comments.</div>}

        {data.map((item, idx: number) => {
          return (
            <div key={idx}>
              <div className="flex items-center">
                <img alt="" className="border rounded-3xl p-4" />
                <div className="ml-4">{ellipsisString(item.userAddress)}</div>
                <div className="ml-4 text-secondary" title={new Date(item.timestamp).toLocaleString()}>
                  {format(item.timestamp)}
                </div>
              </div>
              <pre className="p-4">{item.comment}</pre>
            </div>
          );
        })}

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
}
