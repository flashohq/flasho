import { useNotification } from '../Notifications/NotificationProvider';
import { axiosInstance2 } from '../utils/axiosInstance';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Favicon from '../components/favicon/Favicon';
import Head from 'next/head';
import { useDispatch } from 'react-redux';

export default () => {
  const router = useRouter();
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [confirmAdminSecret, setConfirmAdminSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showAdminSecret, setShowAdminSecret] = useState<boolean>(false);
  const [showConfirmAdminSecret, setShowConfirmAdminSecret] =
    useState<boolean>(false);
  const toast = useNotification();
  const toastId = 'loginSuccess';
  const toastId1 = 'loginError';
  const handleAdminSecretChange = (e: any) => {
    setAdminSecret(e.target.value);
  };
  const handleConfirmAdminSecretChange = (e: any) => {
    setConfirmAdminSecret(e.target.value);
  };

  useEffect(() => {
    setHasError(false);
  }, [adminSecret, confirmAdminSecret]);

  const handleSignup = (event: any) => {
    event.preventDefault();
    const reqBody = { new_key: adminSecret };
    if (adminSecret !== confirmAdminSecret) {
      setHasError(true);
      return;
    }
    setIsLoading(true);
    axiosInstance2
      .post('/create_admin_secret', reqBody)
      .then(res => {
        localStorage.setItem('ADMIN_SECRET_KEY', adminSecret);
        router.replace('/connect/db');
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          if (!toast.isActive(toastId1)) {
            toast({
              id: toastId1,
              title: 'Opps! Some error occured',
              status: 'danger'
            });
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <Head>
        <title>Signup - Register Admin Secret</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
      <div className="flex h-screen w-full items-center justify-center bg-empty3">
        <div className="flex w-[26rem] flex-col justify-between px-4">
          <div className="flex items-center justify-center py-4">
            <img src={'logo/logo.svg'} data-cy="logo" className={'w-1/2'} />
          </div>
          <form
            className={
              'flex flex-col justify-end rounded border border-dullwhite px-4 py-4 shadow-xl shadow-gray'
            }
            onSubmit={handleSignup}
          >
            <div className="flex flex-col">
              <div className="mb-4 flex h-12 items-center rounded-md bg-[#edf2f7]">
                <input
                  className="h-full w-80 rounded-t rounded-l rounded-b rounded-r-none bg-white py-2 px-4 outline-none"
                  type={showAdminSecret ? 'text' : 'password'}
                  value={adminSecret}
                  onChange={handleAdminSecretChange}
                  placeholder={'Enter admin-secret'}
                  data-cy="input1"
                />
                <div
                  className="flex h-full w-8 items-center justify-center rounded-r bg-white"
                  onClick={() => setShowAdminSecret(!showAdminSecret)}
                >
                  {!showAdminSecret ? (
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
              <div className="flex h-12 items-center rounded-md bg-[#edf2f7]">
                <input
                  className="h-full w-80 rounded-t rounded-l rounded-b rounded-r-none bg-white py-2 px-4 outline-none"
                  type={showConfirmAdminSecret ? 'text' : 'password'}
                  value={confirmAdminSecret}
                  onChange={handleConfirmAdminSecretChange}
                  placeholder={'Confirm admin-secret'}
                  data-cy="input2"
                />
                <div
                  className="flex h-full w-8 items-center justify-center rounded-r bg-white"
                  onClick={() =>
                    setShowConfirmAdminSecret(!showConfirmAdminSecret)
                  }
                >
                  {!showConfirmAdminSecret ? (
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
              <div className=" flex h-12 items-center py-3">
                {hasError && (
                  <p className="text-red2">*Passwords do not match.</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <button
                className="w-full rounded bg-[#16a34a] py-3 text-lg font-semibold text-white hover:bg-[#15803d]"
                type={'submit'}
                data-cy="signupBtn"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
