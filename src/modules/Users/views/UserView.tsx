import UserSection from '../sections/UserSection';
import UserPageVideosSection from '../sections/VideosSection';

interface UserViewProps {
  userId: string;
}

function UserView({ userId }: UserViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1300px] flex-col gap-y-6 px-4 pt-2.5">
      <UserSection userId={userId} />
      <UserPageVideosSection userId={userId} />
    </div>
  );
}
export default UserView;
