import Head from 'next/head';
import { ReactElement, useState } from 'react';
import Favicon from '../../components/favicon/Favicon';
import Secondary from '../../components/layout/secondary/Secondary';

const Logout = (props: any) => {
  return (
    <div>
      <Head>
        <title>Flasho App</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
    </div>
  );
};

Logout.getLayout = (page: ReactElement) => {
  return <Secondary>{page}</Secondary>;
};

export default Logout;
