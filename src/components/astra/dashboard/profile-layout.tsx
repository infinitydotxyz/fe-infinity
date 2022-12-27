import { ProfileHeader } from './profile-header';
import { useScrollInfo } from './useScrollHook';

export const ProfileLayout: React.FC = ({ children }) => {
  const { setRef, scrollTop } = useScrollInfo();
  const expanded = scrollTop < 100;

  return (
    <div className="flex flex-col h-full w-full">
      <ProfileHeader expanded={expanded} />
      <div ref={setRef} className="overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
