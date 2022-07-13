import * as uuid from 'uuid';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, CollectionReference, doc as firestoreDoc, DocumentData, setDoc } from 'firebase/firestore';
import { firestoreDb } from './firestoreUtils';

export class FirestoreDistributedCounter {
  private shardsRef: CollectionReference<DocumentData>;
  private readonly SHARD_COLLECTION_ID = '_counter_shards_';

  /**
   * Constructs a sharded counter object that references to a field
   * in a document that is a counter.
   *
   * @param doc A reference to a document with a counter field.
   * @param field A path to a counter field in the above document.
   */
  constructor(private doc: firebase.firestore.DocumentReference, private field: string) {
    this.shardsRef = collection(firestoreDb, doc.path, this.SHARD_COLLECTION_ID);
  }

  /**
   * Increment the counter by a given value.
   *
   * e.g.
   * const counter = new sharded.Counter(db.doc("path/document"), "counter");
   * counter.incrementBy(1);
   */
  public incrementBy(val: number): Promise<void> {
    const shardId = uuid.v4();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const increment: any = firebase.firestore.FieldValue.increment(val);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: { [key: string]: any } = this.field
      .split('.')
      .reverse()
      .reduce((value, name) => ({ [name]: value }), increment);
    return setDoc(firestoreDoc(this.shardsRef, shardId), update, { merge: true });
  }
}
