// export const API_BASE = 'http://localhost:9090';
export const API_BASE = 'https://sv.infinity.xyz';

http://localhost:3000/collection/manekigang?tab=NFTs

also add a 'add to cart' btn next to 'add to order' btn
'add to cart' is simply a shortcut that adds single item orders to cart directly instead of 'add item to order' -> 'add order to cart' flow

// home page
https://www.figma.com/file/R14MZXLv336FbK7RNsEZOa/Homepage-reskin?node-id=0%3A1

Hide feed, collection pot, community tab and Orderbook page from UI

make offer broken?
collection/search returns duplicates?

Change colors/fonts of the UI as per new figma

Here are some updates on orders to make sure we're all on the same page:

Order Type Support
To start off we will only support single token and collection wide orders. We will be expanding to more complex order types in the following weeks

Order Schema Updates
Order schema has changed for improved performance and so it should be easier to work with

- I have added a transformer that converts this schema to the old schema in the OrderbookContext on the FE to prevent having to rewrite order components (orderbook-v2 branch)

New Endpoints
There are new order endpoints to query for orders

- GET /v2/collections/:id/orders
- GET /v2/users/:id/orders
- GET/v2/collection/:id/token/:tokenId/orders
- Collection and token endpoints are already integrated with the OrderbookContext on the FE (orderbook-v2 branch)

Create/Purchase Flow
Create order/take order flow has changed since users are no longer executing order transactions and we are working with both signed and unsigned orders. To help with this I've implemented some generate endpoints that will create a flow for the order. These endpoints will return an object containing the approvals to be set, whether the user has enough balance, and signature requests. This means we no longer need to check approvals/balances on the FE.

- Creating a create order flow:

  - Creating a listing - POST /v2/generate/sell
  - Creating an offer/bid - POST /v2/generate/bid

- Creating a take order flow:

  - Taking a listing - POST /v2/generate/buy
  - Taking an offer - POST /v2/generate/sell

- Submit signed orders to the orderbook POST /v2/orders
  - Already integrated with FE (orderbook-v2 branch)

Order Match/Execution Status
To improve transparency around the status of order matching/execution we plan to add some additional information to orders over the next week

Better UX overall including no user initiated txns, simpler/faster flow when buying/making offers

https://docs.google.com/spreadsheets/d/172Rwt4x0WSR9pfIUP9krC4wF6fj6-_r6hRlJvfd-lr8/edit#gid=0

https://beta.gem.xyz/collection/otherdeed

search button ugly
animate collections popout

show cart
collections search field
