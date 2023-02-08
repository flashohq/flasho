import dynamic from 'next/dynamic';
import axiosInstance from '../../../utils/axiosInstance';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './TriggerHome.module.scss';
import PropTypes from 'prop-types';
import { ButtonLG, Button } from '../../library/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const Spinner = dynamic(() => import('../../library/spinner/spinnerXL'));

/* Alert Box for Database not connected. Pass the typeOfMenu as prop */
export const DatabaseNotConnected = (props: any) => {
  const { mode } = props;
  return (
    <div className="flex flex-col items-center">
      <img
        src={'/icons/warning-icon.svg'}
        className={'h-32 w-36'}
        data-cy="warningIcon"
      />
      <div className="flex flex-col">
        <p className="mb-1 text-4xl font-bold text-red xl:text-3xl">
          No Database Connected
        </p>
        <p className="mb-2 text-lg font-medium text-gray2">
          Please connect a database to setup
          {mode !== 'Trigger' ? ' ' + mode : ''} trigger
        </p>
        <Link href={'/setup/integration'}>
          <Button text={'Connect'} />
        </Link>
      </div>
    </div>
  );
};

export const ServiceNotConnected = (props: any) => {
  const { mode } = props;
  return (
    <div className="flex flex-col items-center">
      <img
        src={'/icons/warning-icon.svg'}
        className={'h-32 w-36'}
        data-cy="warningIcon"
      />
      <div className="flex flex-col items-center">
        <p className="mb-1 text-4xl font-bold text-red xl:text-3xl">
          No {mode} Service Connected
        </p>
        <p className="mb-2 text-lg font-medium text-gray2">
          Please connect {mode} service to setup {mode} Triggers
        </p>
        <Link href={'/setup/integration'}>
          <Button text={'Connect'} />
        </Link>
      </div>
    </div>
  );
};

export const DBandServiceNotConnected = (props: any) => {
  const { mode } = props;
  return (
    <div className="flex flex-col items-center">
      <img
        src={'/icons/warning-icon.svg'}
        className={'h-32 w-36'}
        data-cy="warningIcon"
      />
      <div className="flex flex-col items-center">
        <p className="mb-1 text-4xl font-bold text-red xl:text-3xl">
          No Database and {mode} Service Connected
        </p>
        <p className="mb-2 text-lg font-medium text-gray2">
          Please connect a database and {mode} service to setup {mode} Triggers
        </p>
        <Link href={'/setup/integration'}>
          <Button text={'Connect'} />
        </Link>
      </div>
    </div>
  );
};

/* Alert Box for Triggers */
export const TriggerServicesNotConnected = () => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={'/icons/warning-icon.svg'}
        className={'h-32 w-36'}
        data-cy="warningIcon"
      />
      <div className="flex flex-col items-center">
        <p className="mb-1 text-4xl font-bold text-red xl:text-3xl">
          No Database and SMS/Email Service Connection found
        </p>
        <p className="mb-2 text-lg font-medium text-gray2">
          Please connect database and either an SMS or Email service to setup
          Triggers
        </p>
        <Link href={'/setup/integration'}>
          <Button text={'Connect'} />
        </Link>
      </div>
    </div>
  );
};

export const SMSorEmailServicesNotConnected = (props: any) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={'/icons/warning-icon.svg'}
        className={'h-32 w-36'}
        data-cy="warningIcon"
      />
      <div className="flex flex-col items-center">
        <p className="mb-1 text-4xl font-bold text-red xl:text-3xl">
          No SMS / E-mail Service Connection found
        </p>
        <p className="mb-2 text-lg font-medium text-gray2">
          Please connect either an SMS or Email service to setup Triggers
        </p>
        <Link href={'/setup/integration'}>
          <Button text={'Connect'} />
        </Link>
      </div>
    </div>
  );
};

const TriggerHome = (props: any) => {
  const { mode } = props;
  const dispatch = useDispatch();
  const dummyId = `d${Math.floor(Math.random() * 1000000 + 1)}`;
  const integrationList: any = useSelector(
    (state: RootState) => state.integrations
  );
  const errorController = () => {
    const integrations: any = {
      db: integrationList.db.filter(
        (item: { is_connected: any }) => item.is_connected
      ),
      email: integrationList.email.filter(
        (item: { is_connected: any }) => item.is_connected
      ),
      sms: integrationList.sms.filter(
        (item: { is_connected: any }) => item.is_connected
      )
    };

    console.log('Integratuons Check', integrations);

    if (
      integrations.db.length === 0 &&
      integrations[mode.toLowerCase()].length === 0
    ) {
      return <DBandServiceNotConnected mode={mode} />;
    } else if (integrations.db.length === 0) {
      return <DatabaseNotConnected mode={mode} />;
    } else if (integrations[mode.toLowerCase()].length === 0) {
      return <ServiceNotConnected mode={mode} />;
    } else {
      return (
        <div className="flex w-full items-center justify-evenly">
          <Link href={`/${mode.toLowerCase()}/${dummyId}`}>
            <ButtonLG text={`Create new ${props.mode}`} style={'w-80'} />
          </Link>
          <Link href={`/${mode.toLowerCase()}/all`}>
            <ButtonLG text={`View existing ${props.mode}`} style={'w-80'} />
          </Link>
        </div>
      );
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.main_content_wrap}>
        {!integrationList ? <Spinner /> : errorController()}
      </div>
    </div>
  );
};

DatabaseNotConnected.propTypes = {
  mode: PropTypes.string
};

ServiceNotConnected.propTypes = {
  mode: PropTypes.string
};

DBandServiceNotConnected.propTypes = {
  mode: PropTypes.string
};

TriggerHome.propTypes = {
  mode: PropTypes.string
};

export default TriggerHome;
