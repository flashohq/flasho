import { useEffect, useState } from 'react';
import { IconButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SERVICE_INTEGRATION } from '../../../redux/types/integration';

const Home = (props: any) => {
  const {
    serviceName,
    setServiceName,
    setActivate,
    openToggleActivation,
    openDeleteService,
    setMenuTabState,
    setIsReconfigure,
    openConnectPostgreSQL,
    openConnectAmazonSNS,
    openConnectAmazonSES,
    openConnectPinpointEmail,
    openConnectPinpointSMS,
    openConnectSendGrid,
    openConnectTwilio
  } = props;

  const dispatch = useDispatch();
  const dbList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.db
  );
  const smsList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.sms
  );
  const emailList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.email
  );
  const [dbServices, setDbServices] = useState<boolean>(false);
  const [emailServices, setEmailServices] = useState<boolean>(false);
  const [smsServices, setSMSServices] = useState<boolean>(false);

  const checkServices = () => {
    if (dbList.filter(item => item.is_connected).length > 0) {
      setDbServices(true);
    } else {
      setDbServices(false);
    }
    if (smsList.filter(item => item.is_connected).length > 0) {
      setSMSServices(true);
    } else {
      setSMSServices(false);
    }
    if (emailList.filter(item => item.is_connected).length > 0) {
      setEmailServices(true);
    } else {
      setEmailServices(false);
    }
  };

  useEffect(() => {
    checkServices();
  }, [dbList, emailList, smsList, serviceName]);

  const reconfigureService = (type: string, lable: string) => {
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
            openConnectPinpointEmail();
            break;
          }
          case 'SendGrid': {
            openConnectSendGrid();
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
            openConnectPinpointSMS();
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

  useEffect(() => {
    dispatch.integrations.LOAD_CONFIG();
  }, []);

  const toggleActivation = (service: string, activate: boolean) => {
    setActivate(activate);
    setServiceName(service);
    openToggleActivation();
  };

  const deleteIntegration = (service: string) => {
    setServiceName(service);
    openDeleteService();
  };

  return (
    <div className="h-full w-full bg-white">
      <>
        <div className="flex h-16 w-full items-center justify-between bg-gray px-3">
          <p className="text-2xl font-semibold text-black">Integrations</p>
          <IconButton
            icon={'/icons/plus_honeydew_nobg.svg'}
            text={'New Connection'}
            style={'border-none bg-red'}
            textStyle={'font-bold text-honeydew text-lg'}
            onClick={() => setMenuTabState('add')}
          />
        </div>
        <div className={'max-h-full w-full flex-grow overflow-y-auto'}>
          <div className="w-full px-3 py-4">
            <div className="w-full">
              <h2 className={'my-2 text-2xl font-semibold text-blue'}>
                Database
              </h2>
              <div className="flex w-full flex-col">
                {!dbServices ? (
                  <div className="flex h-16 w-full items-center rounded text-[#ff0000]">
                    No database connected
                  </div>
                ) : (
                  dbList.map(
                    (content: any, index: number) =>
                      content.is_connected && (
                        <div
                          className="mb-4 flex h-16 w-full items-center justify-between rounded bg-[#a8dadc80] px-4"
                          key={index}
                        >
                          <h2 className="text-xl">{content.label}</h2>
                          <div className="flex items-center">
                            <button
                              className={`mr-3 h-12 w-32 rounded-md border-2 bg-red2 text-lg font-semibold text-white`}
                              onClick={() => deleteIntegration(content.value)}
                              data-cy="deleteDB"
                            >
                              Delete
                            </button>
                            <button
                              className={`h-12 w-32 rounded-md border-2 border-blueTag text-lg font-semibold text-blueTag`}
                              onClick={() => {
                                setIsReconfigure(true);
                                reconfigureService('DB', content.label);
                              }}
                              data-cy="reconfigDB"
                            >
                              Reconfigure
                            </button>
                          </div>
                        </div>
                      )
                  )
                )}
              </div>
            </div>
            <div className="mt-4 w-full">
              <h2 className={'my-2 text-2xl font-semibold text-blue'}>
                Email Services
              </h2>
              <div className="flex w-full flex-col">
                {!emailServices ? (
                  <div className="flex h-16 w-full items-center rounded text-[#ff0000]">
                    No email service connected
                  </div>
                ) : (
                  emailList.map(
                    (content: any, index: number) =>
                      content.is_connected && (
                        <div
                          className="mb-4 flex h-16 w-full items-center justify-between rounded bg-[#a8dadc80] px-4"
                          key={index}
                        >
                          <h2 className="text-xl">{content.label}</h2>
                          <div className="flex items-center">
                            <button
                              className={`mr-3 h-12 w-32 rounded-md border-2 text-lg font-semibold
                          ${
                            content.is_active
                              ? ' border-red2 text-red'
                              : 'border-[#00ff00] text-[#13b205]'
                          }
                          `}
                              onClick={() =>
                                toggleActivation(
                                  content.value === 'pinpoint'
                                    ? 'pinpoint_email'
                                    : content.value,
                                  content.is_active
                                )
                              }
                              data-cy="toggleEmail"
                            >
                              {content.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className={`mr-3 h-12 w-32 rounded-md border-2 bg-red2 text-lg font-semibold text-white`}
                              onClick={() =>
                                deleteIntegration(
                                  content.value === 'pinpoint'
                                    ? 'pinpoint_email'
                                    : content.value
                                )
                              }
                              data-cy="deleteEmail"
                            >
                              Delete
                            </button>
                            <button
                              className={`h-12 w-32 rounded-md border-2 border-blueTag text-lg font-semibold text-blueTag`}
                              onClick={() => {
                                setIsReconfigure(true);
                                reconfigureService('Email', content.label);
                              }}
                              data-cy="reconfigEmail"
                            >
                              Reconfigure
                            </button>
                          </div>
                        </div>
                      )
                  )
                )}
              </div>
            </div>
            <div className="mt-4 w-full">
              <h2 className={'my-2 text-2xl font-semibold text-blue'}>
                SMS Services
              </h2>
              <div className="flex w-full flex-col">
                {!smsServices ? (
                  <div className="flex h-16 w-full items-center rounded text-[#ff0000]">
                    No sms service connected
                  </div>
                ) : (
                  smsList.map(
                    (content: any, index: number) =>
                      content.is_connected && (
                        <div
                          className="mb-4 flex h-16 w-full items-center justify-between rounded bg-[#a8dadc80] px-4"
                          key={index}
                        >
                          <h2 className="text-xl">{content.label}</h2>
                          <div className="flex items-center">
                            <button
                              className={`mr-3 h-12 w-32 rounded-md border-2 text-lg font-semibold
                      ${
                        content.is_active
                          ? ' border-red2 text-red'
                          : 'border-[#00ff00] text-[#13b205]'
                      }
                      `}
                              onClick={() =>
                                toggleActivation(
                                  content.value === 'pinpoint'
                                    ? 'pinpoint_sms'
                                    : content.value,
                                  content.is_active
                                )
                              }
                              data-cy="toggleSMS"
                            >
                              {content.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className={`mr-3 h-12 w-32 rounded-md border-2 bg-red2 text-lg font-semibold text-white`}
                              onClick={() =>
                                deleteIntegration(
                                  content.value === 'pinpoint'
                                    ? 'pinpoint_sms'
                                    : content.value
                                )
                              }
                              data-cy="deleteSMS"
                            >
                              Delete
                            </button>
                            <button
                              className={`h-12 w-32 rounded-md border-2 border-blueTag text-lg font-semibold text-blueTag`}
                              onClick={() => {
                                setIsReconfigure(true);
                                reconfigureService('SMS', content.label);
                              }}
                              data-cy="reconfigSMS"
                            >
                              Reconfigure
                            </button>
                          </div>
                        </div>
                      )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

Home.propTypes = {
  serviceName: PropTypes.string,
  setServiceName: PropTypes.func,
  setActivate: PropTypes.func,
  openToggleActivation: PropTypes.func,
  openDeleteService: PropTypes.func,
  setMenuTabState: PropTypes.func,
  setIsReconfigure: PropTypes.func,
  openConnectPostgreSQL: PropTypes.func,
  openConnectAmazonSNS: PropTypes.func,
  openConnectAmazonSES: PropTypes.func,
  openConnectPinpointEmail: PropTypes.func,
  openConnectPinpointSMS: PropTypes.func,
  openConnectTwilio: PropTypes.func,
  openConnectSendGrid: PropTypes.func
};

export default Home;
