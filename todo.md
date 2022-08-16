marketplace
add buy
close drawer
add buy -> no drawer

remove from cart on cancel drawer

use timeago.js? <div>Expiry date: {format(order.endTimeMs)}</div>

home page feed,

twitter and discord events showing up on feed

twitter bot to broadcast buy orders,

mobile friendliness and FE to be delightful in general

there are other types also
afaik cover, contain, padded are the types

Check the feed collection in firestore
For discord announcements see the readme for social-data-listener repo

Then make a feed page which will be basically the community tab on its own page but data is not specific to the collection instead will be global. So you need to create new endpoints and queries if they don’t already exist

basically this is left: twitter, news, nft transfer and discord events showing up on feed

then start on the reservoir kit

animated gif craziness?

0. You can divide the x-axis into a fixed number (say 10) equal intervals between a min and max. Default is 0 and 10000 (?) ETH
1.
2. In each interval show listings and offers in that interval as bubbles
3. Bubbles represent the number of listings and offers. Greater the number, bigger the bubble. Basically numListings = radius of the listings bubble, numOffers = radius of the offers bubble. You obviously need to normalize (scale) these values to a fixed range so that large values don't draw very large bubbles and small values don't draw bubbles that are too tiny
4. Hovering on each bubble opens a tool tip that shows the list of listings (or offers if it's an offer bubble). Each item in the list is a tuple (image, collection name, token id, price) (edited)
   [7:01 PM]
5. User can use a slider to control the min and max prices(which is equivalent to zooming in and out), that makes a new query and fetches new data (edited)
