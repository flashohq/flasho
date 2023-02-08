import { useNotification } from '../../../Notifications/NotificationProvider';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  SENDGRID_CREDENTIALS,
  SERVICE_TYPES
} from '../../../redux/types/credentials';

const defaultFormData = {
  sendgrid_api_key: '',
  source_email_address: ''
};

const AddTwilioSendGrid = (props: any) => {
  const { open, closeModal, isReconfigure, setIsReconfigure, isOnboarding } =
    props;
  const notification = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const credentials = useSelector((state: RootState) => state.credentials);
  const dispatch = useDispatch();

  const connect = () => {
    setIsSubmitting(true);
    axiosInstance
      .post('/v1/settings/initialize_sendgrid', formData)
      .then(() => {
        notification({
          title: `Twilio SendGrid ${
            isReconfigure ? 'Reconfigured' : 'Connected'
          }`,
          description: `Twilio SendGrid is ${
            isReconfigure ? 'reconfigured' : 'connected'
          } successfully`,
          status: 'success'
        });
        dispatch.integrations.LOAD_CONFIG();
        dispatch.credentials.ADD_CREDENTIALS({
          service_name: SERVICE_TYPES.SENDGRID,
          credentials: formData
        });
        setIsReconfigure(true);
        closeModal();

        setIsSubmitting(false);
        if (props.isOnboarding) {
          props.setIsSkip(false);
        }
      })
      .catch(error => {
        const errorDetails = error.response?.data?.detail;
        notification({
          title: 'Failed',
          description: errorDetails.message,
          status: 'danger'
        });
        setIsSubmitting(false);
      })
      .finally(() => {
        setFormData(defaultFormData);
      });
  };

  const [formData, setFormData] =
    useState<SENDGRID_CREDENTIALS>(defaultFormData);

  useEffect(() => {
    if (isReconfigure && open && !isOnboarding) {
      dispatch.credentials.LOAD_CREDENTIALS('twilio_sendgrid');
      setFormData(credentials['twilio_sendgrid'] as SENDGRID_CREDENTIALS);
    }
  }, [isReconfigure]);

  useEffect(() => {
    setFormData(defaultFormData);
  }, []);

  const handleFormData = (e: any) => {
    let form: any = { ...formData };
    form[e.target.name] = e.target.value;
    setFormData(form);
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">
            {isReconfigure ? 'Reconfigure' : 'Connect'} your Twilio SendGrid
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
            data-cy="closeTwilio"
          />
        </div>
        <div className="modal_content">
          <form>
            <div className="v_stack">
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="ses_access_key_id">
                  SendGrid API Key
                </label>
                <input
                  className="modal_input"
                  placeholder="API Key"
                  name="sendgrid_api_key"
                  id="sendgrid_api_id"
                  value={formData?.sendgrid_api_key}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="ses_access_key_id">
                  Sender Email
                </label>
                <input
                  className="modal_input"
                  placeholder="Email"
                  name="source_email_address"
                  id="sendgrid_sender_email"
                  value={formData?.source_email_address}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal_footer" data-cy="connectTwilioSendGrid">
          <ModalButton onClick={connect} isLoading={isSubmitting}>
            {isReconfigure ? 'Reconfigure' : 'Connect'}
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

AddTwilioSendGrid.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  isReconfigure: PropTypes.bool,
  setIsReconfigure: PropTypes.func,
  isOnboarding: PropTypes.bool,
  setIsSkip: PropTypes.func
};

export default AddTwilioSendGrid;
