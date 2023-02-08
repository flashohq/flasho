import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const LogsController = (props: any) => {
  const router = useRouter();
  return (
    <div className="flex w-full">
      <button
        onClick={() => router.push('/log/sms')}
        className={`flex h-14 w-60 items-center justify-center rounded-t-md text-xl font-semibold text-black hover:bg-hoverblue ${
          props.active === 'sms' && 'bg-white text-red hover:bg-white'
        }`}
      >
        <p>SMS Triggers</p>
      </button>
      <button
        onClick={() => router.push('/log/email')}
        className={`flex h-14 w-60 items-center justify-center rounded-t-md text-xl font-semibold text-black hover:bg-hoverblue ${
          props.active === 'email' && 'bg-white text-red hover:bg-white'
        }`}
      >
        <p>Email Triggers</p>
      </button>
    </div>
  );
};

LogsController.propTypes = {
  active: PropTypes.string
};

export default LogsController;
