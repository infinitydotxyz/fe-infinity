import { doc } from 'firebase/firestore';
import { FirestoreDistributedCounter } from './FirestoreDistributedCounter';
import { COLL_FEED, firestoreDb } from './firestoreUtils';

export async function increaseLikes(userAccount: string, itemId: string) {
  const docRef = doc(firestoreDb, `${COLL_FEED}/${itemId}`);
  // eslint-disable-next-line
  const likes = new FirestoreDistributedCounter(docRef as any, 'likes'); // initialize the sharded counter. // used any for 3rd-party code to work.

  likes.incrementBy(1); // .then(($: any) => console.log('returning document >>>>', $));

  // likes.incrementBy(1).then(($: any) => console.log('returning document >>>>', $));
  // // Listen to locally consistent values
  // views.onSnapshot((snap: any) => {
  //   console.log('Locally consistent view of visits: ' + snap.data());
  // });

  // Alternatively if you don't mind counter delays, you can listen to the document directly.
  // onSnapshot(doc(db, 'pages', 'hello-world'), (snap) => {
  //   console.log('Eventually consistent view of visits: ' + snap.get('stats.views'));
  // });
}

export async function increaseComments(userAccount: string, itemId: string) {
  const docRef = doc(firestoreDb, `${COLL_FEED}/${itemId}`);
  // eslint-disable-next-line
  const likes = new FirestoreDistributedCounter(docRef as any, 'comments'); // initialize the sharded counter. // used any for 3rd-party code to work.

  likes.incrementBy(1);
}
