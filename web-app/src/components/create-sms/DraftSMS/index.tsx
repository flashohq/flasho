import { useNotification } from '../../../Notifications/NotificationProvider';
import CustomTextInput from '../../custom-text-input';
import { Button, IconButton } from '../../library/button';
import { useEffect, useRef, useState } from 'react';
import TestSMS from '../../modals/TestSMS';
import SendSMS from '../../modals/SendSMS';
import InsertVariables from '../../modals/InsertVariables';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SMSTemplate } from '../../../redux/types/sms_template';

const DraftSMS = (props: any) => {
  const { setMessageTabState, isEdit } = props;

  const { sms_template_id } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const dispatch = useDispatch();

  let smsTemplate: any;

  if (sms_template_id) {
    const { [sms_template_id]: template } = useSelector(
      (state: RootState) => state.sms_templates
    );
    smsTemplate = template;
  } else {
    smsTemplate = {};
  }

  console.log({ smsTemplate });
  const [testSMS, setTestSMS] = useState<boolean>(false);
  const [sendSMS, setSendSMS] = useState<boolean>(false);
  const [testSMSVariables, setTestSMSVariables] = useState<object[]>();
  const [insertVariables, setInsertVariables] = useState<boolean>(false);
  const textAreaRef: any = useRef();

  const notification = useNotification();
  const notificationID = 'testError';

  const openModal = (modalType: string) => {
    if (smsTemplate.message_body.length === 0) {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: 'Please draft a message first',
          status: 'danger'
        });
      }
    } else {
      if (modalType === 'test') setTestSMS(true);
      else setSendSMS(true);
    }
  };

  const closeTestModal = () => {
    setTestSMS(false);
  };

  const closeSendModal = () => {
    setSendSMS(false);
  };

  const closeInsertVarModal = () => {
    setInsertVariables(false);
  };

  const addVariableToTextField = (variableName: any) => {
    textAreaRef.current?.addTextToTextArea(`{{${variableName}}}`);
  };

  const extractVariablesFromText = () => {
    let regex = /\{\{[^}]*\}\}/gim;
    let matchedVars = smsTemplate.message_body.match(regex);
    console.log('Matched Data', matchedVars);

    const testSMSVar = matchedVars
      ? matchedVars.reduce(
          (acc: { [x: string]: string }, curr: string | number) => (
            (acc[curr] = ''), acc
          ),
          {}
        )
      : {};

    setTestSMSVariables(testSMSVar);
  };

  return (
    <>
      <TestSMS
        open={testSMS}
        closeModal={closeTestModal}
        testSMSVariables={testSMSVariables}
        setTestSMSVariables={setTestSMSVariables}
        smsTemplate={smsTemplate}
      />
      <SendSMS
        open={sendSMS}
        closeModal={closeSendModal}
        smsTemplateId={sms_template_id}
      />
      <InsertVariables
        open={insertVariables}
        closeModal={closeInsertVarModal}
        addVariableToTextField={addVariableToTextField}
      />
      <div className={'flex h-full w-full flex-grow flex-col items-center'}>
        <section className="step_header relative">
          <img
            src={'/icons/back_blue.svg'}
            className={'absolute left-2 h-6 w-6 cursor-pointer object-contain'}
            onClick={() => setMessageTabState('create')}
            data-cy="backBtn"
          />
          <h2>Draft and Send</h2>
          <Button
            text={`${isEdit ? 'Save Changes' : 'Submit'}`}
            textStyle={'text-lg text-medium'}
            style={'absolute right-4 h-10 px-4'}
            onClick={() => openModal('send')}
          />
        </section>
        <div className="flex w-full flex-grow flex-col items-center py-4">
          <div className="mx-auto flex h-full w-5/6 items-center pb-4">
            <CustomTextInput
              type={'area'}
              ref={textAreaRef}
              value={smsTemplate.message_body}
              onChange={(text: string) =>
                dispatch.sms_templates.UPDATE_SMS_TEMPLATE({
                  sms_template_id,
                  key: 'message_body',
                  value: text
                })
              }
              placeholder="Type your message here"
              className={
                'h-full w-full resize-none rounded-md border border-dullwhite bg-white p-2 text-lg outline-blue'
              }
              data-cy="typeMessage"
            />
          </div>
          <div className="flex h-12 w-full items-center justify-center">
            <Button
              onClick={() => setMessageTabState('preview')}
              text={'Preview'}
              textStyle={'text-red'}
              style={'bg-inherit border-2 border-red w-32 mr-2'}
            />
            <IconButton
              icon={'/icons/plus_honeydew.svg'}
              text={'Add Variables'}
              textStyle={'text-blue font-semibold'}
              style={'border-0 shadow-none mr-2'}
              onClick={() => setInsertVariables(true)}
            />
            <Button
              text={'Test'}
              onClick={() => {
                extractVariablesFromText();
                openModal('test');
              }}
              textStyle={'text-red'}
              style={'bg-inherit border-2 border-red w-32'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

DraftSMS.propTypes = {
  setMessageTabState: PropTypes.func,
  smsTemplate: PropTypes.object,
  setSmsTemplate: PropTypes.func,
  primaryVariables: PropTypes.arrayOf(PropTypes.object),
  derivedVariables: PropTypes.arrayOf(PropTypes.object)
};

export default DraftSMS;
