/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as uuid from 'uuid';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
  doc as firestoreDoc,
  setDoc,
  onSnapshot,
  collection,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';

const SHARD_COLLECTION_ID = '_counter_shards_';
const COOKIE_NAME = 'FIRESTORE_COUNTER_SHARD_ID';

export interface CounterSnapshot {
  exists: boolean;
  data: () => number;
}

export class Counter {
  private db: firebase.firestore.Firestore | null = null;
  private shardId = '';
  private shards: { [key: string]: number } = {};
  private notifyPromise: Promise<void> | null = null;
  private shardsRef: CollectionReference<DocumentData>;

  /**
   * Constructs a sharded counter object that references to a field
   * in a document that is a counter.
   *
   * @param doc A reference to a document with a counter field.
   * @param field A path to a counter field in the above document.
   */
  constructor(
    private doc: firebase.firestore.DocumentReference,
    private field: string // private userAccount: string, // private itemId: string
  ) {
    this.db = doc.firestore;
    firebase.initializeApp(this.db.app.options);

    this.shardId = getShardId(COOKIE_NAME);
    this.shardsRef = collection(this.db, doc.path, SHARD_COLLECTION_ID);
    this.shards[doc.path] = 0;
    this.shards[this.shardsRef.path + '/' + this.shardId] = 0;
    this.shards[this.shardsRef.path + '/' + '\t' + this.shardId.substr(0, 4)] = 0;
    this.shards[this.shardsRef.path + '/' + '\t\t' + this.shardId.substr(0, 3)] = 0;
    this.shards[this.shardsRef.path + '/' + '\t\t\t' + this.shardId.substr(0, 2)] = 0;
    this.shards[this.shardsRef.path + '/' + '\t\t\t' + this.shardId.substr(0, 1)] = 0;
  }

  /**
   * Get latency compensated view of the counter.
   *
   * All local increments will be reflected in the counter even if the main
   * counter hasn't been updated yet.
   */
  public async get(options?: firebase.firestore.GetOptions): Promise<number> {
    const valuePromises = Object.keys(this.shards).map(async (path) => {
      const shard = await this.db?.doc(path).get(options);
      return <number>shard?.get(this.field) || 0;
    });
    const values = await Promise.all(valuePromises);
    return values.reduce((a, b) => a + b, 0);
  }

  /**
   * Listen to latency compensated view of the counter.
   *
   * All local increments to this counter will be immediately visible in the
   * snapshot.
   */
  public onSnapshot(observable: (next: CounterSnapshot) => void) {
    Object.keys(this.shards).forEach((path) => {
      const document = firebase.firestore().doc(path);

      onSnapshot(document, (snap: firebase.firestore.DocumentData) => {
        this.shards[snap.ref.path] = snap.get(this.field) || 0;
        if (this.notifyPromise !== null) {
          return;
        }
        this.notifyPromise = schedule(() => {
          const sum = Object.values(this.shards).reduce((a, b) => a + b, 0);
          observable({ exists: true, data: () => sum });
          this.notifyPromise = null;
        });
      });
    });
  }

  /**
   * Increment the counter by a given value.
   *
   * e.g.
   * const counter = new sharded.Counter(db.doc("path/document"), "counter");
   * counter.incrementBy(1);
   */
  public incrementBy(val: number): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const increment: any = firebase.firestore.FieldValue.increment(val);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: { [key: string]: any } = this.field
      .split('.')
      .reverse()
      .reduce((value, name) => ({ [name]: value }), increment);
    // console.log('*** update', update);

    return setDoc(firestoreDoc(this.shardsRef, this.shardId), update, { merge: true });
  }

  /**
   * Access the assigned shard directly. Useful to update multiple counters
   * at the same time, batches or transactions.
   *
   * e.g.
   * const counter = new sharded.Counter(db.doc("path/counter"), "");
   * const shardRef = counter.shard();
   * shardRef.set({"counter1", firestore.FieldValue.Increment(1),
   *               "counter2", firestore.FieldValue.Increment(1));
   */
  public shard(): firebase.firestore.DocumentReference {
    return this.doc.collection(SHARD_COLLECTION_ID).doc(this.shardId);
  }
}

async function schedule<T>(func: () => T): Promise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(async () => {
      const result = func();
      resolve(result);
    }, 0);
  });
}

// function getShardId(cookie: string, userAccount: string, itemId: string): string {
function getShardId(cookie: string): string {
  // eslint-disable-next-line
  const result = new RegExp('(?:^|; )' + encodeURIComponent(cookie) + '=([^;]*)').exec(document.cookie);
  // console.log('result', result);
  if (result) {
    return result[1];
  }

  const shardId = uuid.v4(); // userAccount + '_' + itemId; // uuid.v4();
  // console.log('shardId', shardId);

  const date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();

  document.cookie = encodeURIComponent(cookie) + '=' + shardId + expires + '; path=/';
  return shardId;
}
