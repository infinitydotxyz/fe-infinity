// export const API_BASE = 'http://localhost:9090';
export const API_BASE = 'https://sv.infinity.xyz';

one other bug i found: when the network is not ethereum, we show a banner on top
that is not static right now, it scrolls with the page
fix it to the top even on scroll

remove gray and bold on table title

scroll bar on side drawer and modal

sort button no in the default state button title wrong most recent

http://localhost:3000/collection/manekigang?tab=Reservoir
[9:41 PM]

1. after add to order is clicked, btn state doesn't change to added
   [9:41 PM]
2. no filters on the tab? can you add price filters?
   [9:42 PM]
3. what are these items? are they available to buy? if so, where is the price displayed? (edited)
   [9:42 PM]
   On the NFTs tab:
   http://localhost:3000/collection/manekigang?tab=NFTs
   [9:43 PM]
   also add a 'add to cart' btn next to 'add to order' btn
   [9:44 PM]
   'add to cart' is simply a shortcut that adds single item orders to cart directly instead of 'add item to order' -> 'add order to cart' flow
