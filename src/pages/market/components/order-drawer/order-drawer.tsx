export {};

// import { Fragment, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { XIcon } from '@heroicons/react/outline';
// import { MinusCircleIcon } from '@heroicons/react/solid';
// import { BigNumberish } from 'ethers';
// import { nowSeconds } from '@infinityxyz/lib/utils';
// import { TextInput, Spacer, Button, DateInput } from '.';

// interface ListItemData {
//   tokenName: string;
//   collectionName: string;
//   imageUrl: string;
// }

// const nfts: ListItemData[] = [
//   {
//     tokenName: 'Crpto Bois',
//     collectionName: 'ONI Force',
//     imageUrl: 'https://picsum.photos/80'
//   },
//   {
//     tokenName: 'Douchy Punk',
//     collectionName: 'GReAT aPes',
//     imageUrl: 'https://picsum.photos/80'
//   },
//   {
//     tokenName: 'Fireballz Latchkey',
//     collectionName: 'Storkz Bros',
//     imageUrl: 'https://picsum.photos/80'
//   }
// ];

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// export function OrderDrawer({ open, onClose }: Props) {
//   const [startPrice, setStartPrice] = useState<BigNumberish>(1);
//   const [endPrice, setEndPrice] = useState<BigNumberish>(1);
//   const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
//   const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds().add(1000));
//   const [numItems, setNumItems] = useState<BigNumberish>(1);

//   const list = (
//     <ul role="list" className="  divide-y divide-gray-200 overflow-y-auto">
//       {nfts.map((nft) => (
//         <ListItem key={nft.tokenName} nft={nft} />
//       ))}
//     </ul>
//   );

//   const title = 'Create Order';

//   const header = (
//     <div className="p-6">
//       <div className="flex items-start justify-between">
//         <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
//         <div className="ml-3 flex h-7 items-center">
//           <button
//             type="button"
//             className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
//             onClick={onClose}
//           >
//             <span className="sr-only">Close panel</span>
//             <XIcon className="h-6 w-6" aria-hidden="true" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const footer = (
//     <div className="flex flex-col items-center mb-4">
//       {/* divider line */}
//       <div className="h-px w-full bg-slate-200 mb-4" />

//       <Button onClick={onClose}>Add Order</Button>
//     </div>
//   );

//   const numItemsField = (
//     <TextInput
//       type="number"
//       placeholder="4"
//       label="Num Items"
//       value={numItems.toString()}
//       // onSubmit={() => {
//       //   onSubmit();
//       // }}
//       onChange={(value) => setNumItems(parseInt(value))}
//     />
//   );

//   const startPriceField = (
//     <TextInput
//       type="number"
//       value={startPrice.toString()}
//       placeholder="2.33"
//       label="Start Price"
//       // onSubmit={() => {
//       //   onSubmit();
//       // }}
//       onChange={(value) => setStartPrice(parseFloat(value))}
//     />
//   );

//   const endPriceField = (
//     <TextInput
//       type="number"
//       value={endPrice.toString()}
//       placeholder="2.33"
//       label="End Price"
//       // onSubmit={() => {
//       //   onSubmit();
//       // }}
//       onChange={(value) => setEndPrice(parseFloat(value))}
//     />
//   );

//   const startTimeField = (
//     <DateInput
//       label="Start Time"
//       value={new Date(parseInt(startTime.toString()) * 1000)}
//       onChange={(date) => {
//         setStartTime(date.getTime() / 1000);
//       }}
//     />
//   );

//   const endTimeField = (
//     <DateInput
//       label="End Time"
//       value={new Date(parseInt(endTime.toString()) * 1000)}
//       onChange={(date) => {
//         setEndTime(date.getTime() / 1000);
//       }}
//     />
//   );

//   return (
//     <Transition.Root show={open} as={Fragment}>
//       <Dialog as="div" className="z-50 fixed inset-0 overflow-hidden" onClose={onClose}>
//         <div className="absolute inset-0 overflow-hidden">
//           <Dialog.Overlay className="absolute inset-0" />

//           <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
//             <Transition.Child
//               as={Fragment}
//               enter="transform transition ease-in-out duration-300 sm:duration-500"
//               enterFrom="translate-x-full"
//               enterTo="translate-x-0"
//               leave="transform transition ease-in-out duration-300 sm:duration-500"
//               leaveFrom="translate-x-0"
//               leaveTo="translate-x-full"
//             >
//               <div className="pointer-events-auto w-screen max-w-md">
//                 <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
//                   {header}
//                   {list}
//                   <div className="flex flex-col px-6">
//                     {numItemsField}
//                     {startPriceField}
//                     {endPriceField}
//                     {startTimeField}
//                     {endTimeField}
//                   </div>

//                   <Spacer />

//                   {footer}
//                 </div>
//               </div>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// }

// // ==================================================================
// // ==================================================================

// interface Props2 {
//   nft: ListItemData;
// }

// function ListItem({ nft }: Props2) {
//   const menu = (
//     <button
//       type="button"
//       className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
//       onClick={() => {
//         console.log('flsjdfksjdlf');
//       }}
//     >
//       <span className="flex h-full w-full items-center justify-center rounded-full">
//         <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
//       </span>
//     </button>
//   );

//   return (
//     <li key={nft.tokenName}>
//       <div className="group  relative">
//         <div className="flex items-center py-6 px-5 group-hover:bg-gray-50">
//           <div className="relative flex min-w-0 flex-1 items-center">
//             <span className="relative inline-block flex-shrink-0">
//               <img className="h-10 w-10 rounded-2xl" src={nft.imageUrl} alt="" />
//             </span>
//             <div className="ml-4 truncate">
//               <p className="truncate text-sm font-medium text-gray-900">{nft.tokenName}</p>
//               <p className="truncate text-sm text-gray-500">{'@' + nft.collectionName}</p>
//             </div>
//           </div>
//           {menu}
//         </div>
//       </div>
//     </li>
//   );
// }
