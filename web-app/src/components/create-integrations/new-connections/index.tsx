import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { SERVICE_INTEGRATION } from '../../../redux/types/integration';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const NewConnections = (props: any) => {
  const {
    setMenuTabState,
    menuTabState,
    openConnectPostgreSQL,
    openConnectAmazonSNS,
    openConnectAmazonSES,
    openConnectAmazonPinpointSMS,
    openConnectAmazonPinpointEmail,
    openConnectTwilio,
    openConnectTwilioSendGrid
  } = props;

  const dbList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.db
  );

  const smsList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.sms
  );
  const emailList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.email
  );

  useEffect(() => {
    console.log('DbList', dbList);
  }, [dbList]);

  const configureService = (type: string, lable: string) => {
    switch (type) {
      case 'DB': {
        switch (lable) {
          case 'Postgres': {
            openConnectPostgreSQL();
            break;
          }
        }
        break;
      }
      case 'Email': {
        switch (lable) {
          case 'SES': {
            openConnectAmazonSES();
            break;
          }
          case 'Pinpoint': {
            openConnectAmazonPinpointEmail();
            break;
          }
          case 'SendGrid': {
            openConnectTwilioSendGrid();
            break;
          }
        }
        break;
      }

      case 'SMS': {
        switch (lable) {
          case 'SNS': {
            openConnectAmazonSNS();
            break;
          }
          case 'Pinpoint': {
            openConnectAmazonPinpointSMS();
            break;
          }
          case 'Twilio': {
            openConnectTwilio();
            break;
          }
        }
        break;
      }
    }
  };

  return (
    <div className={'h-full w-full rounded-lg bg-white'}>
      <Transition
        show={menuTabState === 'add'}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0 scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
      >
        <div className="relative flex h-16 w-full items-center justify-center bg-gray px-3">
          <p className="text-2xl font-semibold text-black">
            What do you want to connect ?
          </p>
          <img
            src={'/icons/back_blue.svg'}
            className={'absolute left-2 h-6 w-6 cursor-pointer object-contain'}
            onClick={() => setMenuTabState('home')}
            data-cy="backBtn"
          />
        </div>
        <div className="w-full px-4 py-3">
          <div className="flex w-full flex-col px-2">
            <div className="mb-3 w-full">
              <h2 className={'my-2 text-2xl font-semibold text-blue'}>
                Database
              </h2>
              <div className="flex items-center">
                {dbList.map((content: any, idx: number) => {
                  return (
                    <button
                      onClick={() => {
                        configureService('DB', content.label);
                      }}
                      disabled={content.is_connected}
                      className="mr-4 flex h-16 max-w-max items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                    >
                      <img
                        src={`/icons/${content.value}.svg`}
                        className="mr-2 h-6 w-6 object-contain"
                      />
                      <p className="flex items-center text-xl font-medium text-black">
                        {content.label}
                        {content.is_connected && (
                          <img
                            src="/icons/processed.svg"
                            className="ml-4"
                            alt="success"
                          />
                        )}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-3 w-full">
              <h2 className={'my-2 text-2xl font-semibold text-blue'}>
                SMS / Email Provider
              </h2>
              <div className="flex items-center">
                {emailList.map((content: any, idx: number) => {
                  return (
                    <button
                      onClick={() => {
                        configureService('Email', content.label);
                      }}
                      disabled={content.is_connected}
                      className="mr-4 flex h-16 max-w-max items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                    >
                      <img
                        src={`/icons/${content.value}.svg`}
                        className="mr-2 h-6 w-6 object-contain"
                      />
                      <p className="flex items-center text-xl font-medium text-black">
                        {content.label === 'Pinpoint'
                          ? 'Pinpoint Email'
                          : content.label}
                        {content.is_connected && (
                          <img
                            src="/icons/processed.svg"
                            className="ml-4"
                            alt="success"
                          />
                        )}
                      </p>
                    </button>
                  );
                })}

                {smsList.map((content: any, idx: number) => {
                  return (
                    <button
                      onClick={() => {
                        configureService('SMS', content.label);
                      }}
                      disabled={content.is_connected}
                      className="mr-4 flex h-16 max-w-max items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                    >
                      <img
                        src={`/icons/${content.value}.svg`}
                        className="mr-2 h-6 w-6 object-contain"
                      />

                      <p className="flex items-center text-xl font-medium text-black">
                        {content.label === 'Pinpoint'
                          ? 'Pinpoint SMS'
                          : content.label}
                        {content.is_connected && (
                          <img
                            src="/icons/processed.svg"
                            className="ml-4"
                            alt="success"
                          />
                        )}
                      </p>
                    </button>
                  );
                })}
                {/* <button
                  onClick={openConnectAmazonSNS}
                  className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                >
                  <img
                    src="/icons/sns.svg"
                    className="mr-2 h-6 w-6 object-contain"
                  />
                  <p className="text-xl font-medium text-black">Amazon SNS</p>
                </button>
                <button
                  onClick={openConnectAmazonSES}
                  className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                >
                  <img
                    src="/icons/ses.svg"
                    className="mr-2 h-6 w-6 object-contain"
                  />
                  <p className="text-xl font-medium text-black">Amazon SES</p>
                </button>

                <button
                  onClick={openConnectAmazonPinpointSMS}
                  className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                >
                  <img
                    src="/icons/pinpoint.svg"
                    className="mr-2 h-6 w-6 object-contain"
                  />
                  <p className="text-xl font-medium text-black">
                    Amazon Pinpoint SMS
                  </p>
                </button>

                <button
                  onClick={openConnectAmazonPinpointEmail}
                  className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                >
                  <img
                    src="/icons/pinpoint.svg"
                    className="mr-2 h-6 w-6 object-contain"
                  />
                  <p className="text-xl font-medium text-black">
                    Amazon Pinpoint Email
                  </p>
                </button>

                <button
                  onClick={openConnectTwilio}
                  className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                >
                  <img
                    src="/icons/twilio.svg"
                    className="mr-2 h-6 w-6 object-contain"
                  />
                  <p className="text-xl font-medium text-black">Twilio</p>
                </button>

                <button
                  onClick={openConnectTwilioSendGrid}
                  className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                >
                  <img
                    src="/icons/twilio_sendgrid.svg"
                    className="mr-2 h-6 w-6 object-contain"
                  />
                  <p className="text-xl font-medium text-black">
                    Twilio SendGrid
                  </p>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

NewConnections.propTypes = {
  setMenuTabState: PropTypes.func,
  menuTabState: PropTypes.string,
  openConnectPostgreSQL: PropTypes.func,
  openConnectAmazonSNS: PropTypes.func,
  openConnectAmazonSES: PropTypes.func,
  openConnectAmazonPinpointSMS: PropTypes.func,
  openConnectAmazonPinpointEmail: PropTypes.func,
  openConnectTwilio: PropTypes.func,
  openConnectTwilioSendGrid: PropTypes.func
};

export default NewConnections;
