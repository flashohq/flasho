import { useNotification } from '../Notifications/NotificationProvider';
import { axiosInstance2 } from '../utils/axiosInstance';
import { useState } from 'react';
import Head from 'next/head';
import Favicon from '../components/favicon/Favicon';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

export default () => {
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const dispatch = useDispatch();

  const toast = useNotification();
  const toastId = 'loginSuccess';
  const toastId1 = 'loginError';
  const router = useRouter();

  const handleChange = (e: any) => {
    setAdminSecret(e.target.value);
  };
  const handleLogin = (event: any) => {
    event.preventDefault();
    const config = { headers: { 'x-admin-secret-key': adminSecret } };
    setIsLoading(true);
    axiosInstance2
      .get('/v1/settings/get_integrations', config)
      .then(res => {
        localStorage.setItem('ADMIN_SECRET_KEY', adminSecret);
        setIsLoading(false);
        router.replace('/');
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.status === 401) {
          if (!toast.isActive(toastId1)) {
            toast({
              id: toastId1,
              title: 'Invalid admin-secret',
              description: 'Kindly enter the correct credentials',
              status: 'danger'
            });
          }
        }
      });
  };
  return (
    <>
      <Head>
        <title>Login - Enter Admin Secret</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
      <div className="flex h-screen w-full items-center justify-center bg-empty3">
        <div className="flex w-[26rem] flex-col justify-between px-4">
          <div className="flex items-center justify-center py-4">
            <img src={'logo/logo.svg'} className={'w-1/2'} data-cy="logo" />
          </div>
          <form
            className={
              'flex flex-col justify-end rounded border border-dullwhite px-4 py-4 shadow-xl shadow-gray'
            }
            onSubmit={handleLogin}
          >
            <div className="flex flex-col">
              <div className="flex h-12 items-center rounded-md bg-[#edf2f7]">
                <input
                  className="h-full w-80 rounded-t rounded-l rounded-b rounded-r-none bg-white py-2 px-4 outline-none"
                  type={showSecret ? 'text' : 'password'}
                  value={adminSecret}
                  onChange={handleChange}
                  placeholder={'Enter admin-secret'}
                  data-cy="input"
                />
                <div
                  className="flex h-full w-8 items-center justify-center rounded-r bg-white"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {!showSecret ? (
                    <img
                      src={'/icons/hide.svg'}
                      className={'h-5 w-5 object-contain opacity-60'}
                    />
                  ) : (
                    <img
                      src={'/icons/show.svg'}
                      className={'h-5 w-5 object-contain opacity-60'}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <button
                className="w-full rounded bg-[#16a34a] py-3 text-lg font-semibold text-white hover:bg-[#15803d]"
                type={'submit'}
                data-cy="loginBtn"
              >
                Enter
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
