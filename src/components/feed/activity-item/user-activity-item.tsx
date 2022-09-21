interface Props {
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const UserActivityItem = ({ avatar, title, children }: Props) => {
  return (
    <div>
      <div className="bg-theme-light-200 px-10 py-6 rounded-3xl flex items-center font-heading">
        {avatar && avatar}
        <div className="flex justify-between w-full mx-8 ml-4">
          {title}
          {children}
        </div>
      </div>
    </div>
  );
};
