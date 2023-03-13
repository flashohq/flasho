import { useState } from 'react';
import Home from './home';
import NewConnections from './new-connections';
import AddAmazonSES from '../modals/AddAmazonSES';
import AddAmazonSNS from '../modals/AddAmazonSNS';
import AddPostgreSQL from '../modals/AddPostgreSQL';
import AddTwilio from '../modals/AddTwilio';
import AddTwilioSendGrid from '../modals/AddTwilioSendGrid';
import AddAmazonPinpointSMS from '../modals/AddAmazonPinpointSMS';
import AddAmazonPinpointEmail from '../modals/AddAmazonPinpointEmail';
import AddMessageBird from '../modals/AddMessageBird';
import ToggleConnection from '../modals/ToggleConnection';
import DeleteService from '../modals/DeleteService';

const CreateIntegrations = () => {
  const [menuTabState, setMenuTabState] = useState<string>('home');
  const [serviceName, setServiceName] = useState<string>('');
  const [activate, setActivate] = useState<boolean>(false);
  const [isReconfigure, setIsReconfigure] = useState<boolean>(false);

  const [connectPostgreSQL, setConnectPostgreSQL] = useState<boolean>(false);
  const [connectAmazonSNS, setConnectAmazonSNS] = useState<boolean>(false);
  const [connectAmazonSES, setConnectAmazonSES] = useState<boolean>(false);
  const [toggleActivation, setToggleActivation] = useState<boolean>(false);
  const [deleteService, setDeleteService] = useState<boolean>(false);

  const [connectAmazonPinpointSMS, setConnectAmazonPinpointSMS] =
    useState<boolean>(false);
  const [connectAmazonPinpointEmail, setConnectAmazonPinpointEmail] =
    useState<boolean>(false);

  const [connectTwilio, setConnectTwilio] = useState<boolean>(false);
  const [connectTwilioSendGrid, setConnectTwilioSendGrid] =
    useState<boolean>(false);

  const [connectMessageBird, setConnectMessageBird] = useState<boolean>(false);

  const openToggleActivation = () => {
    setToggleActivation(true);
  };

  const openDeleteService = () => {
    setDeleteService(true);
  };

  const openConnectPostgreSQL = () => {
    setConnectPostgreSQL(true);
  };

  const openConnectTwilio = () => {
    setConnectTwilio(true);
  };
  const openConnectTwilioSendGrid = () => {
    setConnectTwilioSendGrid(true);
  };

  const openConnectAmazonSNS = () => {
    setConnectAmazonSNS(true);
  };

  const openConnectAmazonSES = () => {
    setConnectAmazonSES(true);
  };
  const openConnectAmazonPinpointSMS = () => {
    setConnectAmazonPinpointSMS(true);
  };
  const openConnectAmazonPinpointEmail = () => {
    setConnectAmazonPinpointEmail(true);
  };

  const openConnectMessageBird = () => {
    setConnectMessageBird(true);
  }

  return (
    <div className="h-full w-full rounded">
      <div className="h-full w-full bg-empty">
        <ToggleConnection
          open={toggleActivation}
          closeModal={() => setToggleActivation(false)}
          serviceName={serviceName}
          activate={activate}
        />
        <DeleteService
          open={deleteService}
          closeModal={() => setDeleteService(false)}
          serviceName={serviceName}
        />
        <AddPostgreSQL
          open={connectPostgreSQL}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectPostgreSQL(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddAmazonSNS
          open={connectAmazonSNS}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectAmazonSNS(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddAmazonSES
          open={connectAmazonSES}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectAmazonSES(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddAmazonPinpointSMS
          open={connectAmazonPinpointSMS}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectAmazonPinpointSMS(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddAmazonPinpointEmail
          open={connectAmazonPinpointEmail}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectAmazonPinpointEmail(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddTwilio
          open={connectTwilio}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectTwilio(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddTwilioSendGrid
          open={connectTwilioSendGrid}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectTwilioSendGrid(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />
        <AddMessageBird 
          open={connectMessageBird}
          closeModal={() => {
            setIsReconfigure(false);
            setConnectMessageBird(false);
          }}
          isReconfigure={isReconfigure}
          setIsReconfigure={setIsReconfigure}
        />

        {menuTabState === 'home' && (
          <Home
            serviceName={serviceName}
            setServiceName={setServiceName}
            setActivate={setActivate}
            openToggleActivation={openToggleActivation}
            openDeleteService={openDeleteService}
            setMenuTabState={setMenuTabState}
            setIsReconfigure={setIsReconfigure}
            openConnectPostgreSQL={openConnectPostgreSQL}
            openConnectAmazonSNS={openConnectAmazonSNS}
            openConnectAmazonSES={openConnectAmazonSES}
            openConnectPinpointEmail={openConnectAmazonPinpointEmail}
            openConnectPinpointSMS={openConnectAmazonPinpointSMS}
            openConnectSendGrid={openConnectTwilioSendGrid}
            openConnectTwilio={openConnectTwilio}
            openConnectMessageBird={openConnectMessageBird}
          />
        )}
        {menuTabState === 'add' && (
          <NewConnections
            setMenuTabState={setMenuTabState}
            menuTabState={menuTabState}
            openConnectPostgreSQL={openConnectPostgreSQL}
            openConnectAmazonSNS={openConnectAmazonSNS}
            openConnectAmazonSES={openConnectAmazonSES}
            openConnectAmazonPinpointSMS={openConnectAmazonPinpointSMS}
            openConnectAmazonPinpointEmail={openConnectAmazonPinpointEmail}
            openConnectTwilio={openConnectTwilio}
            openConnectTwilioSendGrid={openConnectTwilioSendGrid}
            openConnectMessageBird={openConnectMessageBird}
          />
        )}
      </div>
    </div>
  );
};

export default CreateIntegrations;
