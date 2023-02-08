import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';

const AuthGuard = (WrappedComponent: any) => {
  const authComponent = (props: any) => {
    const router = useRouter();
    const [hasError, setHasError] = useState<boolean>(false);
    useEffect(() => {
      axiosInstance
        .get('/v1/settings/get_integrations')
        .then((res: any) => {})
        .catch((error: AxiosError) => {
          if (error.response?.status === 401) {
            setHasError(true);
            setTimeout(() => {
              setTimeout(() => {
                setHasError(false);
              }, 1000);
              router.replace('/login');
            }, 1000);
          } else if (error.response?.status === 403) {
            setHasError(true);
            setTimeout(() => {
              setTimeout(() => {
                setHasError(false);
              }, 1000);
              router.replace('/signup');
            }, 1000);
          }
        });
      return () => {
        setHasError(false);
      };
    }, []);

    return hasError ? (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <h1 className=" text-xl font-bold">Redirecting ...</h1>
      </div>
    ) : (
      <WrappedComponent {...props} />
    );
  };
  return authComponent;
};

export default AuthGuard;
