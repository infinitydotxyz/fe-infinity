interface Props {
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const UserActivityItem = ({ avatar, title, children }: Props) => {
  return (
    <div className="bg-theme-light-200 px-10 py-6 rounded-3xl flex items-center font-heading overflow-hidden">
      {avatar}
      <div className="w-full mx-8 ml-4 flex items-center overflow-none">
        <div className="mr-4">{title}</div>
        <div className="w-full flex flex-row justify-between items-center">{children}</div>
      </div>
    </div>
  );
};
