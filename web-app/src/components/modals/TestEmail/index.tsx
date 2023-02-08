import { useEffect, useState } from 'react';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';

const TestEmail = (props: any) => {
  const {
    open,
    closeModal,
    submit,
    submitLoading,
    testEmailVariables,
    setTestEmailVariables
  } = props;

  const [testEmail, setTestEmail] = useState<string>('');

  const handleEmailChange = (e: any) => {
    setTestEmail(e.target.value);
  };

  const handleChangeTestVariables = (e: any, key: string) => {
    let testVars = { ...testEmailVariables };
    testVars = { ...testVars, [key]: e.target.value };
    setTestEmailVariables(testVars);
  };

  return (
    <div className={` modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">
            Send a sample Email to a test email address
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="modal_content my-5 px-9">
          <form>
            <div className="h_stack">
              <label className="input_label w-fit" htmlFor="test_email">
                Test Email Address
              </label>
              <input
                type="email"
                id="test_email"
                className="modal_input"
                placeholder="Email Address"
                value={testEmail}
                onChange={handleEmailChange}
                data-cy="emailInput"
              />
            </div>
          </form>
        </div>
        {testEmailVariables && (
          <div className="mt-3 w-full px-9">
            <p className="mb-2">Enter the values for the variables</p>
            <div className="flex max-h-80 flex-col overflow-y-auto p-2">
              {Object.keys(testEmailVariables).map((key: string) => (
                <div className="group relative z-10 mb-2 flex h-12 w-2/3 rounded border-2 border-dullwhite pt-2 focus-within:border-blue">
                  <p
                    className={
                      testEmailVariables[key].length === 0
                        ? 'input_label_styled'
                        : 'input_label_fixed'
                    }
                  >
                    {key.replace(/[{}]/g, '')}
                  </p>

                  <input
                    value={testEmailVariables[key]}
                    className={'h-9 w-full px-2 focus-within:outline-none'}
                    onChange={(e: any) => handleChangeTestVariables(e, key)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="modal_footer">
          <ModalButton
            onClick={() => submit(testEmail)}
            isLoading={submitLoading}
          >
            Send
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

TestEmail.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  submit: PropTypes.func,
  submitLoading: PropTypes.bool,
  testEmailVariables: PropTypes.object,
  setTestEmailVariables: PropTypes.func
};

export default TestEmail;
