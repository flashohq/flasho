import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TriggerController from '../trigger-menu/trigger-controller';
import Channel from '../trigger-menu/trigger-steps/Channel';
import Conditions from '../trigger-menu/trigger-steps/Conditions';
import Message from '../trigger-menu/trigger-steps/Message';
import Triggers from '../trigger-menu/trigger-steps/Triggers';
import Variables from '../trigger-menu/trigger-steps/Variables';
import style from './TriggerMenu.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import VariablesManual from '../trigger-menu/trigger-manual-steps/VariablesManual';
import IntegrationManual from '../trigger-menu/trigger-manual-steps/Integration';
import Spinner from '../library/spinner/spinner';

export default (props: any) => {
  const { mode } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const triggerId: string | string[] | undefined = router.query.trigger_id;

  const email_templates = useSelector(
    (state: RootState) => state.email_templates.user
  );
  const sms_templates = useSelector((state: RootState) => state.sms_templates);
  const userTable = useSelector((state: RootState) => state.user_table);

  const { id, activeTab, event, isEdit } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const [active, setActive] = useState<number>(isEdit ? 1 : 0);

  useEffect(() => {
    if (Object.keys(userTable).length === 0) {
      dispatch.user_table.getUserTable();
    }
  }, [userTable]);

  useEffect(() => {
    //@ts-ignore
    if (id !== parseInt(triggerId) && triggerId.startsWith('d')) {
      dispatch.trigger_drafts.addDraft({
        id: triggerId,
        messageMode:
          mode === 'SMS' ? 'sms' : mode === 'Trigger' ? 'trigger' : 'email'
      });
    }
  }, []);

  const Back = () => {
    if (active >= 1) {
      setActive(active - 1);
    } else router.back();
  };

  return !id || id.toString() !== triggerId ? (
    <div className="flex h-full w-full items-center justify-center rounded bg-white ">
      <Spinner />
    </div>
  ) : (
    <>
      <div className={style.main_container}>
        <div className={style.main_wrap}>
          <div className={style.main_header}>
            {mode !== 'Trigger' && (
              <div
                onClick={Back}
                className={
                  'flex h-full cursor-pointer items-center justify-center rounded-full'
                }
              >
                <img
                  src={'/icons/arrow-back.svg'}
                  className={'absolute left-2 h-8 w-8 hover:opacity-80'}
                />
              </div>
            )}
            {mode === 'Trigger' && active >= 1 && (
              <div
                onClick={Back}
                className={
                  'flex h-full cursor-pointer items-center justify-center rounded-full '
                }
              >
                <img
                  src={'/icons/arrow-back.svg'}
                  className={'absolute left-2 h-8 w-8 hover:opacity-80'}
                />
              </div>
            )}
            <h1 className="text-2xl font-medium text-black">
              Configure Triggers
            </h1>
          </div>
          <div className={style.main_content_container}>
            <div className={style.main_content_header}>
              <TriggerController isEdit={isEdit} />
            </div>
            <div className={style.main_content_wrap}>
              {activeTab === 'Triggers' && <Triggers />}
              {activeTab === 'Variables' &&
                (event === 'MANUAL' ? (
                  <VariablesManual isEdit={isEdit} />
                ) : (
                  <Variables isEdit={isEdit} />
                ))}
              {activeTab === 'Conditions' && <Conditions />}
              {activeTab === 'Channel' && (
                <Channel
                  emailTemplates={email_templates}
                  smsTemplates={sms_templates}
                  mode={mode}
                />
              )}
              {activeTab === 'Message' && <Message />}
              {activeTab === 'Integration' && <IntegrationManual />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
