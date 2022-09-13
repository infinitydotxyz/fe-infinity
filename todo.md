hey can you make sure NFT_TRANSFER, 'TOKENS_STAKED', 'USER_VOTE' events show up in the UI and user can filter them (edited)

check FeedEvent.ts file in lib repo
lmk once these are done
next big item we want is a 'product' home page (edited)

nneverlander — Today at 12:36 PM
if you are going to use firestore IN query, keep in mind it only supports upto 10 values
check this piece of code
const events = query.events && query?.events.length > 0 ? query.events : Object.values(EventType).slice(10); // slice because firestore 'IN' query can only support 10 items

    let userEventsQuery = this.firebaseService.firestore
      .collection(firestoreConstants.FEED_COLL)
      .where('type', 'in', events)
      .where('usersInvolved', 'array-contains', user.userAddress);

in getActivity method in user.service.ts
