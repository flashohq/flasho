import Head from 'next/head';
import { ReactElement, useState } from 'react';
import Favicon from '../../components/favicon/Favicon';
import Secondary from '../../components/layout/secondary/Secondary';
import LogoutUser from '../../components/logout-user';
import design from '../../styles/PageDefault.module.scss';

const About = (props: any) => {
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
      <LogoutUser />
    </div>
  );
};

About.getLayout = (page: ReactElement) => {
  return <Secondary>{page}</Secondary>;
};

export default About;
