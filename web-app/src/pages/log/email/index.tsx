import { ReactElement, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import Main from '../../../components/layout/main/Main';
import style from '../../../styles/GlobalStyles.module.scss';
import LogsTriggerLists from '../../../components/logs-trigger-lists';
import LogsController from '../../../components/logs-controller';
import Head from 'next/head';
import Favicon from '../../../components/favicon/Favicon';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { TRIGGER_LOG_ELEMENT } from '../../../redux/types/logs';

const Logs = (props: any) => {
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
            <LogsController active={'email'} />
            <Box className={style.tab_panel}>
              <Box width={'100%'} h={'100%'} borderRadius={'6px'} bg={'white'}>
                <LogsTriggerLists type={'email'} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

Logs.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Logs;
