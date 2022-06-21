interface Props {
  fred: string;
}

export const Field = ({ fred }: Props) => {
  console.log(fred);
  // buttons: [
  //   {
  //     type: 'drawer',
  //     url: '',
  //     label: 'Filter',
  //     drawer: {
  //       props: {
  //         open: isDrawerOpen,
  //         onClose: closeDrawer,
  //         title: 'Filter',
  //         subtitle: `Select up to ${filterLimit}`,
  //         divide: true
  //       }
  //     },
  //     props: {
  //       onClick: () => toggleDrawer()
  //     }
  //   }
  // ]
};
