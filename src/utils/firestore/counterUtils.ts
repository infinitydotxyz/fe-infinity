import { firestoreConfig } from './creds';
import { initializeApp } from 'firebase/app';
// Add Firebase products that you want to use
import { getFirestore, doc } from 'firebase/firestore';
import { Counter } from './Counter';
import { COLL_FEED } from './firestoreUtils';

export async function increaseLikes(userAccount: string, itemId: string) {
  const firebaseApp = initializeApp(firestoreConfig);
  const db = getFirestore(firebaseApp);

  const docRef = doc(db, `${COLL_FEED}/${itemId}`);
  // eslint-disable-next-line
  const likes = new Counter(docRef, 'likes'); // initialize the sharded counter.

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
  const firebaseApp = initializeApp(firestoreConfig);
  const db = getFirestore(firebaseApp);

  const docRef = doc(db, `${COLL_FEED}/${itemId}`);
  // eslint-disable-next-line
  const likes = new Counter(docRef, 'comments'); // initialize the sharded counter.

  likes.incrementBy(1);
}
