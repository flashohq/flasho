import CreateTrigger from '../../components/create-trigger';

import Head from 'next/head';
import { ReactElement } from 'react';
import Favicon from '../../components/favicon/Favicon';
import Main2 from '../../components/layout/main/Main';
import design from '../../styles/PageDefault.module.scss';
import { useRouter } from 'next/router';

const Triggers = () => {
  const router = useRouter();
  const { trigger_id } = router.query;
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

      <CreateTrigger mode="Trigger" triggerId={trigger_id} />
    </div>
  );
};

Triggers.getLayout = (page: ReactElement) => {
  return <Main2>{page}</Main2>;
};

export async function getServerSideProps(context: any) {
  return {
    props: {}
  };
}

export default Triggers;
