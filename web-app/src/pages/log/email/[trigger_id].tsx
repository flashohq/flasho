import Head from 'next/head';
import { ReactElement } from 'react';
import Favicon from '../../../components/favicon/Favicon';
import Main from '../../../components/layout/main/Main';
import LogTriggerDetails from '../../../components/log-trigger-details';
import LogsController from '../../../components/logs-controller';

const LogDetails = () => {
  return (
    <>
      <Head>
        <title>Trigger Logs</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
      <div className="h-full w-full rounded bg-empty2 p-1">
        <div className="h-full w-full flex-grow">
          <LogsController active={'email'} />
          <div className="mt-0 overflow-y-auto bg-white pb-1">
            <LogTriggerDetails type={'email'} />
          </div>
        </div>
      </div>
    </>
  );
};

LogDetails.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default LogDetails;
