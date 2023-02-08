import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import Onboarding from '../../components/layout/onboarding';
import AddAmazonSES from '../../components/modals/AddAmazonSES';
import AddAmazonSNS from '../../components/modals/AddAmazonSNS';
import AddAmazonPinpointSMS from '../../components/modals/AddAmazonPinpointSMS';
import AddAmazonPinpointEmail from '../../components/modals/AddAmazonPinpointEmail';
import AddTwilio from '../../components/modals/AddTwilio';
import AddTwilioSendGrid from '../../components/modals/AddTwilioSendGrid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { integrations } from '../../redux/models/integration';
import { SERVICE_INTEGRATION } from '../../redux/types/integration';

const Services = () => {
  const router = useRouter();
  const [openModalSes, setOpenModalSes] = useState<boolean>(false);
  const [openModalSns, setOpenModalSns] = useState<boolean>(false);
  const [openModalPinpointSMS, setOpenModalPinpointSMS] =
    useState<boolean>(false);
  const [openModalPinpointEmail, setOpenModalPinpointEmail] =
    useState<boolean>(false);
  const [openModalTwilio, setOpenModalTwilio] = useState<boolean>(false);
  const [openModalTwilioSendGrid, setOpenModalTwilioSendGrid] =
    useState<boolean>(false);

  const [isSkip, setIsSkip] = useState<boolean>(true);
  const [isReconfigureSES, setIsReconfigureSES] = useState<boolean>(false);
  const [isReconfigureSNS, setIsReconfigureSNS] = useState<boolean>(false);

  const [isReconfigurePinpointSMS, setIsReconfigurePinpointSMS] =
    useState<boolean>(false);
  const [isReconfigurePinpointEmail, setIsReconfigurePinpointEmail] =
    useState<boolean>(false);
  const [isReconfigureTwilio, setIsReconfigureTwilio] =
    useState<boolean>(false);
  const [isReconfigureSendGrid, setIsReconfigureSendGrid] =
    useState<boolean>(false);

  const closeModalSes = () => setOpenModalSes(false);
  const closeModalSns = () => setOpenModalSns(false);
  const closeModalPinpointSMS = () => setOpenModalPinpointSMS(false);
  const closeModalPinpointEmail = () => setOpenModalPinpointEmail(false);
  const closeModalTwilio = () => setOpenModalTwilio(false);
  const closeModalTwilioSendGrid = () => setOpenModalTwilioSendGrid(false);

  const smsList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.sms
  );
  const emailList: SERVICE_INTEGRATION[] = useSelector(
    (state: RootState) => state.integrations.email
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch.integrations.LOAD_CONFIG();
  }, []);

  const configureService = (type: string, lable: string) => {
    switch (type) {
      case 'Email': {
        switch (lable) {
          case 'SES': {
            setOpenModalSes(true);
            break;
          }
          case 'Pinpoint': {
            setOpenModalPinpointEmail(true);
            break;
          }
          case 'SendGrid': {
            setOpenModalTwilioSendGrid(true);
            break;
          }
        }
        break;
      }

      case 'SMS': {
        switch (lable) {
          case 'SNS': {
            setOpenModalSns(true);
            break;
          }
          case 'Pinpoint': {
            setOpenModalPinpointSMS(true);
            break;
          }
          case 'Twilio': {
            setOpenModalTwilio(true);
            break;
          }
        }
        break;
      }
    }
  };

  return (
    <>
      <AddAmazonSES
        open={openModalSes}
        closeModal={closeModalSes}
        isReconfigure={isReconfigureSES}
        setIsReconfigure={setIsReconfigureSES}
        isOnboarding={true}
        setIsSkip={setIsSkip}
      />
      <AddAmazonSNS
        open={openModalSns}
        closeModal={closeModalSns}
        isReconfigure={isReconfigureSNS}
        setIsReconfigure={setIsReconfigureSNS}
        isOnboarding={true}
        setIsSkip={setIsSkip}
      />
      <AddAmazonPinpointSMS
        open={openModalPinpointSMS}
        closeModal={closeModalPinpointSMS}
        isReconfigure={isReconfigurePinpointSMS}
        setIsReconfigure={setIsReconfigurePinpointSMS}
        isOnboarding={true}
        setIsSkip={setIsSkip}
      />
      <AddAmazonPinpointEmail
        open={openModalPinpointEmail}
        closeModal={closeModalPinpointEmail}
        isReconfigure={isReconfigurePinpointEmail}
        setIsReconfigure={setIsReconfigurePinpointEmail}
        isOnboarding={true}
        setIsSkip={setIsSkip}
      />
      <AddTwilio
        open={openModalTwilio}
        closeModal={closeModalTwilio}
        isReconfigure={isReconfigureTwilio}
        setIsReconfigure={setIsReconfigureTwilio}
        isOnboarding={true}
        setIsSkip={setIsSkip}
      />
      <AddTwilioSendGrid
        open={openModalTwilioSendGrid}
        closeModal={closeModalTwilioSendGrid}
        isReconfigure={isReconfigureSendGrid}
        setIsReconfigure={setIsReconfigureSendGrid}
        isOnboarding={true}
        setIsSkip={setIsSkip}
      />
      <div className="h-full w-full">
        <div className="relative flex h-full flex-col bg-white">
          <h2 className="flex h-16 items-center justify-center bg-gray text-xl font-medium text-black">
            Please connect your services
          </h2>
          <div className="mt-8 flex w-full flex-col items-center">
            <h2 className="mb-8 text-xl font-semibold text-blue">
              SMS / Email Providers
            </h2>
            <div className="flex items-center justify-center">
              {emailList.map((content: any, idx: number) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      configureService('Email', content.label);
                    }}
                    disabled={content.is_connected}
                    className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
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
                    key={idx}
                    onClick={() => {
                      configureService('SMS', content.label);
                    }}
                    disabled={content.is_connected}
                    className="mr-4 flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
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
            </div>
          </div>
          <div className="flex h-16 w-full items-center justify-center">
            <button
              className="absolute bottom-8 flex h-12 w-32  items-center justify-center rounded bg-red text-xl font-semibold text-white"
              onClick={() => router.replace('/')}
            >
              {isSkip ? 'Skip' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

Services.getLayout = (page: ReactElement) => {
  return <Onboarding>{page}</Onboarding>;
};

export default Services;
