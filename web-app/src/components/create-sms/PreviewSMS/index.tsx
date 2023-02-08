import { useState } from 'react';
import TestSMS from '../../modals/TestSMS';
import SendSMS from '../../modals/SendSMS';
import { Button } from '../../library/button';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SMSTemplate } from '../../../redux/types/sms_template';

const PreviewSMS = (props: any) => {
  const { setMessageTabState } = props;

  const { sms_template_id, isEdit } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  let smsTemplate: any;

  if (sms_template_id) {
    const { [sms_template_id]: template } = useSelector(
      (state: RootState) => state.sms_templates
    );
    smsTemplate = template;
  } else {
    smsTemplate = {};
  }

  const [testSMS, setTestSMS] = useState<boolean>(false);
  const [sendSMS, setSendSMS] = useState<boolean>(false);
  const [testSMSVariables, setTestSMSVariables] = useState<object[]>();

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

  const closeTestModal = () => {
    setTestSMS(false);
  };

  const closeSendModal = () => {
    setSendSMS(false);
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
      <SendSMS open={sendSMS} closeModal={closeSendModal} {...props} />
      <div className={'flex h-full w-full flex-col pb-4'}>
        <section className="step_header relative mb-4">
          <img
            src={'/icons/back_blue.svg'}
            className={'absolute left-2 h-6 w-6 cursor-pointer object-contain'}
            onClick={() => setMessageTabState('draft')}
            data-cy="backBtn"
          />
          <h2>Preview</h2>
        </section>
        <div className="flex h-full w-full flex-col items-center">
          <textarea
            value={smsTemplate.message_body}
            readOnly
            className="mb-4 h-full w-5/6 cursor-default resize-none rounded-md border border-dullwhite"
            data-cy="textArea"
          />

          <div className="h_stack" data-cy="previewSMS">
            <Button
              text={'Test'}
              onClick={() => {
                extractVariablesFromText();
                setTestSMS(true);
              }}
              style={'border-2 border-red bg-inherit mr-4'}
              textStyle={'text-red'}
            />
            <Button
              text={`${isEdit ? 'Submit' : 'Save Changes'}`}
              onClick={() => setSendSMS(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

PreviewSMS.propTypes = {
  setMessageTabState: PropTypes.func,
  smsTemplate: PropTypes.object
};

export default PreviewSMS;
