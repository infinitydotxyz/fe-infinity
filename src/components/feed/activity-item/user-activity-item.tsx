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
        <div className="w-full mx-8 ml-4 flex items-center overflow-none">
          <span className="w-1/5">{title}</span>
          <span className="w-4/5 flex flex-row justify-between items-center">{children}</span>
        </div>
      </div>
    </div>
  );
};
