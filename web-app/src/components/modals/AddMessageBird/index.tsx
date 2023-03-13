import { useNotification } from '../../../Notifications/NotificationProvider';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';

import {
    MESSAGEBIRD_CREDENTIALS,
    SERVICE_TYPES
} from '../../../redux/types/credentials';

const defaultFormData = {
    message_bird_access_key: '',
    source_phone_number: ''
}

const AddMessageBird = (props: any) => {
    const {open, closeModal, isReconfigure, setIsReconfigure, isOnboarding} = 
      props;

    const notification = useNotification();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const credentials = useSelector((state: RootState) => state.credentials);
    const dispatch = useDispatch();

    const connect = () => {
      setIsSubmitting(true);
      //TODO: INITIALIZE MESSAGEBIRD
      //TODO: THEN SEND NOTIFICATION
      console.log(formData);
      axiosInstance
        .post('/v1/settings/initialize_message_bird', formData)
        .then((res) => {
          console.log("SUCCESS");
          console.log(res);
          // setIsReconfigure(true);
          closeModal();

          setIsSubmitting(false);
          if (props.isOnboarding) {
            props.setIsSkip(false);
          }
        })
        .catch(error => {
          console.log({"ERROR": error});
        })
        .finally(() => {
          setFormData(defaultFormData);
        })
    }

    const [formData, setFormData] =
      useState<MESSAGEBIRD_CREDENTIALS>(defaultFormData);

    useEffect(() => {
        if (isReconfigure && open && !isOnboarding) {
            dispatch.credentials.LOAD_CREDENTIALS('messagebird');
            setFormData(credentials['messagebird'] as MESSAGEBIRD_CREDENTIALS);      
        }
    }, [isReconfigure]);
    
    useEffect(() => {
        setFormData(defaultFormData);
    }, []);

    const handleFormData = (e: any) => {
        let form: any = { ...formData };
        form[e.target.name] = e.target.value;
        setFormData(form);
    }

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
                  <label className="input_label" htmlFor="message_bird_access_id">
                    MessageBird Access Key
                  </label>
                  <input
                    className="modal_input"
                    placeholder="Access Key"
                    name="message_bird_access_key"
                    id="message_bird_access_id"
                    value={formData?.message_bird_access_key}
                    autoComplete={'off'}
                    onChange={handleFormData}
                  />
                </div>
                <div className="h_stack mb-1.5">
                  <label className="input_label" htmlFor="message_bird_access_id">
                    Sender Phone Number
                  </label>
                  <input
                    className="modal_input"
                    placeholder="Phone Number"
                    name="source_phone_number"
                    id="message_bird_phone_number"
                    value={formData?.source_phone_number}
                    autoComplete={'off'}
                    onChange={handleFormData}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal_footer" data-cy="connectMessageBird">
            <ModalButton onClick={connect} isLoading={isSubmitting}>
              {isReconfigure ? 'Reconfigure' : 'Connect'}
            </ModalButton>
          </div>
        </div>
      </div>
    )
}

AddMessageBird.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  isReconfigure: PropTypes.bool,
  setIsReconfigure: PropTypes.func,
  isOnboarding: PropTypes.bool,
  setIsSkip: PropTypes.func
}

export default AddMessageBird;