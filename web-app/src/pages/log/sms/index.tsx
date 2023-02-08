import { ReactElement } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';

import Main2 from '../../../components/layout/main/Main';
import style from '../../../styles/GlobalStyles.module.scss';
import LogsTriggerLists from '../../../components/logs-trigger-lists';
import { useRouter } from 'next/router';
import LogsController from '../../../components/logs-controller';
import Head from 'next/head';
import Favicon from '../../../components/favicon/Favicon';

const Logs = (props: any) => {
  const router = useRouter();
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
      <Box className={style.main_container}>
        <Box className={style.main_wrap}>
          <Box className={style.tabs}>
            <LogsController active={'sms'} />
            <Box className={style.tab_panel}>
              <Box
                width={'100%'}
                h={'100%'}
                borderRadius={'6px'}
                borderTopLeftRadius={'none'}
                bg={'white'}
              >
                <LogsTriggerLists type={'sms'} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

Logs.getLayout = function getLayout(page: ReactElement) {
  return <Main2>{page}</Main2>;
};

export default Logs;
