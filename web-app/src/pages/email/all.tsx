import { ReactElement } from 'react';
import TriggerList from '../../components/trigger-list';
import Main from '../../components/layout/main/Main';

export const EmailTriggers = () => {
  return <TriggerList type={'email'} />;
};

EmailTriggers.getLayout = (page: ReactElement) => {
  return <Main>{page}</Main>;
};

export async function getServerSideProps(context: any) {
  return {
    props: {}
  };
}

export default EmailTriggers;
