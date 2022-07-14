import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where
} from 'firebase/firestore';

import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { firestoreConstants } from '@infinityxyz/lib-frontend/utils';
import { increaseComments } from './counterUtils';
import { firestoreConfig } from './creds';
import { apiPost } from '../apiUtils';

interface IncrementQuery {
  liked: boolean;
  eventId: string;
  userAddress: string;
}

const EVENTS_PER_PAGE = 10;
const COMMENTS_PER_PAGE = 20;

export type FeedFilter = {
  types?: EventType[];
  collectionAddress?: string;
  tokenId?: string;
  userAddress?: string;
};

export type Comment = {
  userAddress: string;
  username?: string;
  comment: string;
  timestamp: number;
};

initializeApp(firestoreConfig);

export const firestoreDb = getFirestore();

export async function getCollectionDocs(collectionPath: string) {
  try {
    const coll = collection(firestoreDb, collectionPath);
    const snapshot = await getDocs(coll);
    const list = snapshot.docs.map((item) => item.data());
    return list;
  } catch (err) {
    console.error(err);
    throw new Error(`${err}`);
  }
}

let lastDoc: unknown = null;
let lastCommentDoc: unknown = null;

export async function fetchMoreEvents(filter: FeedFilter) {
  const coll = collection(firestoreDb, firestoreConstants.FEED_COLL);

  if (lastDoc) {
    let q;
    if (filter?.collectionAddress) {
      if (filter?.types) {
        q = query(
          coll,
          where('type', 'in', filter?.types),
          where('collectionAddress', '==', filter?.collectionAddress),
          orderBy('timestamp', 'desc'),
          limit(EVENTS_PER_PAGE),
          startAfter(lastDoc)
        );
      } else {
        q = query(
          coll,
          where('collectionAddress', '==', filter?.collectionAddress),
          orderBy('timestamp', 'desc'),
          limit(EVENTS_PER_PAGE),
          startAfter(lastDoc)
        );
      }
    } else {
      if (filter?.types) {
        q = query(
          coll,
          where('type', 'in', filter?.types),
          orderBy('timestamp', 'desc'),
          limit(EVENTS_PER_PAGE),
          startAfter(lastDoc)
        ); // query(coll, limit(3), orderBy('timestamp', 'desc'))
      } else {
        q = query(coll, orderBy('timestamp', 'desc'), limit(EVENTS_PER_PAGE), startAfter(lastDoc)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
      }
    }

    const items = await getDocs(q);

    if (items.docs.length > 0) {
      const arr = [];
      for (const item of items.docs) {
        const docData = { ...item.data(), id: item.id };
        arr.push(docData);
      }
      lastDoc = items.docs[items.docs.length - 1];
      return arr;
    }
  }
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCollectionDoc(path: string, docId: string, data: any) {
  const docRef = doc(firestoreDb, path, docId);
  await updateDoc(docRef, data);
}

export async function addUserLike(liked: boolean, eventId: string, userAddress: string) {
  const { error } = await apiPost(`/feed/${userAddress}/like`, {
    requiresAuth: true,
    data: {
      eventId: eventId,
      liked: liked,
      userAddress: userAddress
    } as IncrementQuery
  });

  if (error) {
    console.log('error in addUserLike');
  }
}

export async function addUserComments({
  eventId,
  userAddress,
  username,
  comment
}: {
  eventId: string;
  userAddress: string;
  username?: string;
  comment: string;
}) {
  const timestamp = Date.now();
  const docRef = doc(firestoreDb, 'feed', eventId, 'userComments', userAddress + '_' + timestamp);
  await setDoc(docRef, { userAddress, username, comment, timestamp });
  increaseComments(userAddress ?? '', eventId);
}

export async function fetchComments(eventId?: string) {
  if (!eventId) {
    return [];
  }
  try {
    const coll = collection(firestoreDb, `feed/${eventId}/userComments`);
    const q = query(coll, orderBy('timestamp', 'desc'), limit(COMMENTS_PER_PAGE)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      const list: Comment[] = [];
      snapshot.forEach((item) => {
        const docData = item.data() as Comment;
        // docData.userAddress = doc.id;
        list.push(docData);
      });
      lastCommentDoc = snapshot.docs[snapshot.docs.length - 1];
      return list;
    }
    return [];
  } catch (err) {
    console.error(err);
    throw new Error(`${err}`);
  }
}

export async function fetchMoreComments(eventId?: string) {
  if (!eventId) {
    return [];
  }
  const coll = collection(firestoreDb, `feed/${eventId}/userComments`);

  if (lastCommentDoc) {
    const q = query(coll, orderBy('timestamp', 'desc'), limit(COMMENTS_PER_PAGE), startAfter(lastCommentDoc)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    const items = await getDocs(q);

    if (items.docs.length > 0) {
      const arr = [];
      for (const item of items.docs) {
        // const docData = { ...item.data(), id: item.id };
        arr.push(item.data());
      }
      lastCommentDoc = items.docs[items.docs.length - 1];
      return arr;
    }
  }
  return [];
}
