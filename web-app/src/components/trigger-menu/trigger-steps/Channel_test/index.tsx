import { useNotification } from '../../../../Notifications/NotificationProvider';
import Spinner from '../../../library/spinner/spinner';
import { useEffect, useState } from 'react';
import AddUserTable from '../../../modals/AddUserTable';
import AddForeignKey from '../../../modals/AddForeignKey';
import { ButtonLG } from '../../../library/button';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import ModeEmail from './mode-email';
import ModeSMS from './mode-sms';

const Channel = (props: any) => {
  const notification = useNotification();
  const notificationID = 'channelError';
  const dispatch = useDispatch();

  const integrationList = useSelector((state: RootState) => state.integrations);

  // if (email_template_id && email_template_id !== '') {
  //   const { [email_template_id]: emailTemplateData } = useSelector(
  //     (state: RootState) => state.email_templates.user
  //   );
  //   templateData = emailTemplateData;
  //   messageModeValue = 'Email';
  // } else if (sms_template_id && sms_template_id !== '') {
  //   const { [sms_template_id]: smsTemplateData } = useSelector(
  //     (state: RootState) => state.sms_templates
  //   );
  //   templateData = smsTemplateData;
  //   messageModeValue = 'SMS';
  // } else {
  //   templateData = {};
  //   messageModeValue = '';
  // }

  const [messageMode, setMessageMode] = useState('Email');

  useEffect(() => {
    if (!integrationList) {
      dispatch.integrations.LOAD_CONFIG();
    }
  }, []);

  const [userTableModal, setUserTableModal] = useState<boolean>(false);
  const [foreignKeyModal, setForeignKeyModal] = useState<boolean>(false);

  const openModal = () => {
    setUserTableModal(true);
  };
  const closeModal = () => {
    setUserTableModal(false);
  };

  const openForeignKeyModal = () => {
    setForeignKeyModal(true);
  };

  const closeForeignKeyModal = () => {
    setForeignKeyModal(false);
  };

  // const validateFormFields = () => {
  //   if (messageService === '') {
  //     return false;
  //   }
  //   if (messageMode === 'SMS') {
  //     if (templateData.has_country_code === 'no') {
  //       if (
  //         templateData.country_code_column === '' ||
  //         templateData.phone_number_column === ''
  //       ) {
  //         return false;
  //       }
  //       return true;
  //     } else {
  //       return templateData.phone_number_column !== '';
  //     }
  //   } else {
  //     return emailColumn !== '';
  //   }
  // };

  // const goToNext = () => {
  //   if (!validateFormFields()) {
  //     if (!notification.isActive(notificationID)) {
  //       notification({
  //         id: notificationID,
  //         title: `Incomplete Fields`,
  //         status: 'danger',
  //         description: 'All fields are mandatory'
  //       });
  //     }
  //   } else {
  //     dispatch.trigger_drafts.updateValue({
  //       key: 'activeTab',
  //       value: 'Message'
  //     });
  //   }
  // };

  // const updateTemplateData = (key: string, value: string) => {
  //   if (messageMode === 'Email') {
  //     dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
  //       email_template_id,
  //       key: key,
  //       value: value
  //     });
  //   } else if (messageMode === 'SMS') {
  //     dispatch.sms_templates.UPDATE_SMS_TEMPLATE({
  //       sms_template_id,
  //       key: key,
  //       value: value
  //     });
  //   }
  // };

  return (
    <>
      {userTableModal && (
        <AddUserTable open={userTableModal} closeModal={closeModal} />
      )}
      {foreignKeyModal && (
        <AddForeignKey
          open={foreignKeyModal}
          closeModal={closeForeignKeyModal}
        />
      )}
      <div className="relative h-full w-full flex-grow bg-white">
        <div className="step_container">
          <div className={`${messageMode === '' ? 'block' : 'hidden'}`}>
            <section className="step_header">
              <h2>How do you want to send this message ?</h2>
            </section>
            <div className="my-4 flex items-center justify-center">
              <button
                className={`mr-4 flex h-12 w-40 items-center justify-center rounded-md border border-dullwhite text-lg font-semibold ${
                  messageMode === 'Email' && 'bg-blue text-honeydew'
                } `}
                onClick={() => {
                  setMessageMode('Email');
                  //updateTemplateData('service_name', '');
                }}
              >
                Email
              </button>
              <button
                className={`flex h-12 w-40 items-center  justify-center rounded-md border border-dullwhite text-lg font-semibold ${
                  messageMode === 'SMS' && 'bg-blue text-honeydew'
                } `}
                onClick={() => {
                  setMessageMode('SMS');
                  //updateTemplateData('service_name', '');
                }}
              >
                SMS
              </button>
            </div>
          </div>
          <div>{messageMode === 'Email' ? <ModeEmail /> : <ModeSMS />}</div>
        </div>
        <section className="absolute bottom-0 flex h-20 w-full items-center justify-center">
          <ButtonLG
          // text={'Next'}
          // onClick={goToNext}
          // isDisabled={!validateFormFields()}
          // style={'px-20 w-56'}
          />
        </section>
      </div>
    </>
  );
};

Channel.propTypes = {
  integrationList: PropTypes.any
};

export default Channel;
