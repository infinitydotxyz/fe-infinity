import { doc } from 'firebase/firestore';
import { FirestoreDistributedCounter } from './FirestoreDistributedCounter';
import { COLL_FEED, firestoreDb } from './firestoreUtils';

export async function increaseLikes(userAccount: string, itemId: string) {
  const docRef = doc(firestoreDb, `${COLL_FEED}/${itemId}`);
  // eslint-disable-next-line
  const likes = new FirestoreDistributedCounter(docRef as any, 'likes');
  likes.incrementBy(1);
}

export async function increaseComments(userAccount: string, itemId: string) {
  const docRef = doc(firestoreDb, `${COLL_FEED}/${itemId}`);
  // eslint-disable-next-line
  const comments = new FirestoreDistributedCounter(docRef as any, 'comments');
  comments.incrementBy(1);
}
