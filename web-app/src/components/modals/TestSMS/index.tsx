//@ts-nocheck
import { useNotification } from '../../../Notifications/NotificationProvider';
import React, { useEffect, useState } from 'react';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import axiosInstance from '../../../utils/axiosInstance';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';
import countryCodes from 'country-codes-list';

let myCountryCodes: any = countryCodes.customList(
  'countryCode',
  '+{countryCallingCode}'
);
const animatedComponents = makeAnimated();

myCountryCodes = Object.values(myCountryCodes);

myCountryCodes = myCountryCodes.map(item => {
  return { label: item, value: item };
});

const customStyles = {
  menuList: (base: any) => ({ ...base, maxHeight: 150, overflowY: 'auto' }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: '1px solid #545556',
    color: '#0e1c36',
    padding: '0.5rem 1rem',
    background: state.isSelected ? '#c3cdd9' : '#fff'
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
  menu: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 4
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 8,
    width: '2rem',
    height: '2.2rem'
  })
};

const TestSMS = (props: any) => {
  const {
    open,
    closeModal,
    smsTemplate,
    testSMSVariables,
    setTestSMSVariables
  } = props;

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const handleCountryCode = (e: any) => {
    setCountryCode(e.value);
  };

  const handlePhoneNumber = (e: any) => {
    setPhoneNumber(e.target.value);
  };

  const notification = useNotification();
  const dangerNotification = 'testSMSModalDanger';
  const successsNotification = 'testSMSModalSuccess';

  const sendTestSMS = () => {
    if (phoneNumber.length < 10) {
      if (!notification.isActive(dangerNotification)) {
        notification({
          id: dangerNotification,
          title: `Phone number error`,
          description: 'Please enter a valid phone number',
          status: 'danger'
        });
      }
    } else {
      setIsSubmitLoading(true);
      /* Code for replacing the variables with values */
      let message_body = smsTemplate.message_body;
      Object.keys(testSMSVariables).forEach(
        (key: string) =>
          (message_body = message_body.replace(key, testSMSVariables[key]))
      );
      const reqBody = {
        service_name: smsTemplate.service_name,
        receipient_phone_number: countryCode + phoneNumber,
        message_body: message_body,
        message_type: smsTemplate.type
      };

      axiosInstance
        .post('/v1/sms/send_sms', reqBody)
        .then(res => {
          setIsSubmitLoading(false);
          if (!notification.isActive(successsNotification)) {
            notification({
              id: successsNotification,
              title: `SMS sent successfully`,
              status: 'success'
            });
          }
          closeModal();
        })
        .catch(e => {
          setIsSubmitLoading(false);
          if (!notification.isActive(successsNotification)) {
            notification({
              id: successsNotification,
              title: `SMS sending failed`,
              status: 'danger'
            });
          }
          console.log(e);
        });
    }
  };

  const country_Code = [
    { value: '+91', label: '+91' },
    { value: '+92', label: '+92' },
    { value: '+01', label: '+01' },
    { value: '+02', label: '+02' },
    { value: '+07', label: '+07' },
    { value: '+100', label: '+100' },
    { value: '+101', label: '+101' },
    { value: '+102', label: '+102' }
  ];

  const handleChangeTestVariables = (e: any, key: string) => {
    let testVars = { ...testSMSVariables };
    testVars = { ...testVars, [key]: e.target.value };
    setTestSMSVariables(testVars);
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Send a sample SMS to a test number</p>
          <img
            src="/icons/cross_black.svg"
            className="cursor-pointer"
            onClick={closeModal}
            data-cy="closeTS"
          />
        </div>
        <div className="modal_content">
          <form>
            <div className="v_stack items-start">
              <p className="py-2">Test Phone Address:</p>
              <div className="h_stack mb-1.5">
                <Select
                  placeholder="+91"
                  defaultInputValue="+91"
                  components={animatedComponents}
                  options={myCountryCodes}
                  onChange={handleCountryCode}
                  styles={customStyles}
                />
                <input
                  type="number"
                  className="modal_input bg-white"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  data-cy="PNumber"
                />
              </div>
            </div>
          </form>
          {testSMSVariables && (
            <div className="mt-3">
              <p className="mb-2">Enter the values for the variables</p>
              <div className="flex max-h-80 flex-col overflow-y-auto p-2">
                {Object.keys(testSMSVariables).map((key: string) => (
                  <div className="group relative z-10 mb-2 flex h-12 w-2/3 rounded border-2 border-dullwhite pt-2 focus-within:border-blue">
                    <p
                      className={
                        testSMSVariables[key].length === 0
                          ? 'input_label_styled'
                          : 'input_label_fixed'
                      }
                    >
                      {key.replace(/[{}]/g, '')}
                    </p>

                    <input
                      value={testSMSVariables[key]}
                      className={'h-9 w-full px-2 focus-within:outline-none'}
                      onChange={(e: any) => handleChangeTestVariables(e, key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal_footer">
          <ModalButton onClick={sendTestSMS} isLoading={isSubmitLoading}>
            Send
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

TestSMS.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  smsTemplate: PropTypes.object,
  testSMSVariables: PropTypes.object,
  setTestSMSVariables: PropTypes.func
};

export default TestSMS;
