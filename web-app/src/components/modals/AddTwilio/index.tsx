import { useNotification } from '../../../Notifications/NotificationProvider';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  SERVICE_TYPES,
  TWILIO_CREDENTIALS
} from '../../../redux/types/credentials';

const defaultFormData = {
  twilio_account_sid: '',
  twilio_auth_token: '',
  twilio_phone_number: ''
};

const AddTwilio = (props: any) => {
  const { open, closeModal, isReconfigure, setIsReconfigure, isOnboarding } =
    props;
  const notification = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const credentials = useSelector((state: RootState) => state.credentials);
  const dispatch = useDispatch();

  const connect = () => {
    setIsSubmitting(true);
    axiosInstance
      .post('v1/settings/initialize_twilio', formData)
      .then(() => {
        notification({
          title: `Twilio ${isReconfigure ? 'Reconfigured' : 'Connected'}`,
          description: `Twilio is ${
            isReconfigure ? 'reconfigured' : 'connected'
          } successfully`,
          status: 'success'
        });
        dispatch.integrations.LOAD_CONFIG();
        dispatch.credentials.ADD_CREDENTIALS({
          service_name: SERVICE_TYPES.TWILIO,
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

  const [formData, setFormData] = useState<TWILIO_CREDENTIALS>(defaultFormData);

  useEffect(() => {
    if (isReconfigure && open && !isOnboarding) {
      dispatch.credentials.LOAD_CREDENTIALS('twilio');
      setFormData(credentials['twilio'] as TWILIO_CREDENTIALS);
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
            {isReconfigure ? 'Reconfigure' : 'Connect'} your Twilio
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
                  Account SID
                </label>
                <input
                  className="modal_input"
                  placeholder="Account SId"
                  name="twilio_account_sid"
                  id="twilio_account_sid_id"
                  value={formData?.twilio_account_sid}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="ses_secret_access_key">
                  AuthToken
                </label>
                <input
                  className="modal_input"
                  placeholder="Auth Token"
                  name="twilio_auth_token"
                  id="twilio_auth_token_id"
                  value={formData?.twilio_auth_token}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="ses_secret_access_key">
                  Twilio Phone Number
                </label>
                <input
                  className="modal_input"
                  placeholder="Phone Number"
                  name="twilio_phone_number"
                  id="twilio_phone_number_id"
                  value={formData?.twilio_phone_number}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal_footer" data-cy="connectTwilio">
          <ModalButton onClick={connect} isLoading={isSubmitting}>
            {isReconfigure ? 'Reconfigure' : 'Connect'}
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

AddTwilio.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  isReconfigure: PropTypes.bool,
  setIsReconfigure: PropTypes.func,
  isOnboarding: PropTypes.bool,
  setIsSkip: PropTypes.func
};

export default AddTwilio;
