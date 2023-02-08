import { useRouter } from 'next/router';
import CreateTrigger from '../../components/create-trigger';

import Head from 'next/head';
import { ReactElement } from 'react';
import Favicon from '../../components/favicon/Favicon';
import Main from '../../components/layout/main/Main';
import design from '../../styles/PageDefault.module.scss';

const Email = (props: any) => {
  const router = useRouter();
  const { trigger_id } = router.query;
  return (
    <div className={design.container}>
      <Head>
        <title>Email Notifications</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
      <CreateTrigger mode="Email" triggerId={trigger_id} />
    </div>
  );
};

Email.getLayout = (page: ReactElement) => {
  return <Main>{page}</Main>;
};

export async function getServerSideProps(context: any) {
  return {
    props: {}
  };
}

export default Email;
