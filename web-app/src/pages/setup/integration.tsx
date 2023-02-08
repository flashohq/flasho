import Head from 'next/head';
import { ReactElement } from 'react';
import CreateIntegrations from '../../components/create-integrations';
import Favicon from '../../components/favicon/Favicon';
import Secondary from '../../components/layout/secondary/Secondary';
import design from '../../styles/PageDefault.module.scss';

const Integration = (props: any) => {
  return (
    <div className={design.container}>
      <Head>
        <title>Flasho App</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
      <CreateIntegrations />
    </div>
  );
};

Integration.getLayout = (page: ReactElement) => {
  return <Secondary>{page}</Secondary>;
};

export default Integration;
