import { useRouter } from 'next/router';
import design from './LogoutUser.module.scss';
import { useDispatch } from 'react-redux';
export default () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="h-full w-full">
      <div className="h-full w-full">
        <div className="flex h-16 w-full items-center justify-between bg-gray px-3">
          <p className="text-2xl font-semibold text-black">Logout</p>
        </div>
        <div className={design.content}>
          <p className="text-xl font-medium text-black">
            By logging out you will be clearing your admin secrets. You can
            enter again by entering the admin secret.
          </p>
          <div className="absolute bottom-0 right-3 flex h-16 items-center justify-end">
            <button
              className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-md bg-red2 text-xl font-semibold text-white"
              onClick={() => {
                localStorage.removeItem('ADMIN_SECRET_KEY');
                router.replace('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
