import { useNotification } from '../../../Notifications/NotificationProvider';
import { useEffect, useState } from 'react';
import makeAnimated from 'react-select/animated';

import Select from 'react-select';
import axiosInstance from '../../../utils/axiosInstance';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  PINPOINT_SMS_CREDENTIALS,
  SERVICE_TYPES
} from '../../../redux/types/credentials';
import { customStyles } from '../../../styles/styled-selectors';

const animatedComponents = makeAnimated();

const defaultFormData = {
  aws_access_key_id: '',
  aws_secret_access_key: '',
  aws_region: '',
  pinpoint_application_id: '',
  sender_phone_number: ''
};

const AddAmazonPinpointSMS = (props: any) => {
  const { open, closeModal, isReconfigure, setIsReconfigure, isOnboarding } =
    props;
  const notification = useNotification();

  const credentials = useSelector((state: RootState) => state.credentials);
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const connect = () => {
    setIsSubmitting(true);
    axiosInstance
      .post('/v1/settings/initialize_pinpoint_sms', formData)
      .then(() => {
        notification({
          title: `Amazon Pinpoint SMS ${
            isReconfigure ? 'Reconfigured' : 'Connected'
          }`,
          description: `Amazon Pinpoint SMS is ${
            isReconfigure ? 'reconfigured' : 'connected'
          } successfully`,
          status: 'success'
        });
        dispatch.integrations.LOAD_CONFIG();
        dispatch.credentials.ADD_CREDENTIALS({
          service_name: SERVICE_TYPES.PINPOINT_SMS,
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

  const [formData, setFormData] = useState<PINPOINT_SMS_CREDENTIALS>({
    aws_access_key_id: '',
    aws_secret_access_key: '',
    aws_region: '',
    pinpoint_application_id: '',
    sender_phone_number: ''
  });

  useEffect(() => {
    if (isReconfigure && open && !isOnboarding) {
      dispatch.credentials.LOAD_CREDENTIALS('pinpoint_sms');
      setFormData(credentials['pinpoint_sms'] as PINPOINT_SMS_CREDENTIALS);
    }
  }, [isReconfigure]);

  useEffect(() => {
    setFormData({
      aws_access_key_id: '',
      aws_secret_access_key: '',
      aws_region: '',
      pinpoint_application_id: '',
      sender_phone_number: ''
    });
  }, []);

  const handleFormData = (e: any) => {
    let form: any = { ...formData };
    form[e.target.name] = e.target.value;
    setFormData(form);
  };

  const region = [
    {
      label: 'ap-south-1',
      value: 'ap-south-1'
    },
    {
      label: 'us-east-1',
      value: 'us-east-1'
    },
    {
      label: 'us-west-2',
      value: 'us-west-2'
    },
    {
      label: 'us-west-1',
      value: 'us-west-1'
    },
    {
      label: 'eu-west-1',
      value: 'eu-west-1'
    },
    {
      label: 'eu-central-1',
      value: 'eu-central-1'
    },
    {
      label: 'ap-southeast-1',
      value: 'ap-southeast-1'
    },
    {
      label: 'ap-northeast-1',
      value: 'ap-northeast-1'
    },
    {
      label: 'ap-southeast-2',
      value: 'ap-southeast-2'
    },
    {
      label: 'ap-northeast-2',
      value: 'ap-northeast-2'
    },
    {
      label: 'sa-east-1',
      value: 'sa-east-1'
    },
    {
      label: 'cn-north-1',
      value: 'cn-north-1'
    }
  ];

  const handleRegion = (e: any) => {
    let form = { ...formData };
    form['aws_region'] = e.value;
    setFormData(form);
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">
            {isReconfigure ? 'Reconfigure' : 'Connect'} your Amazon Pinpoint SMS
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
            data-cy="closeSNS"
          />
        </div>
        <div className="modal_content">
          <form>
            <div className="v-stack">
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="sns_access_key_id">
                  Access Key ID
                </label>
                <input
                  className="modal_input"
                  placeholder="Access Key"
                  name="aws_access_key_id"
                  id="pinpoint_access_key_id"
                  value={formData?.aws_access_key_id}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="sns_secret_access_key">
                  Secret Access Key
                </label>
                <input
                  className="modal_input"
                  placeholder="Secret Key"
                  name="aws_secret_access_key"
                  id="pinpoint_secret_access_key_id"
                  value={formData?.aws_secret_access_key}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label pr-1" htmlFor="sns_aws_region">
                  Region
                </label>
                <Select
                  id="pinpoint_aws_region"
                  placeholder="Select Region"
                  components={animatedComponents}
                  options={region}
                  onChange={handleRegion}
                  styles={customStyles}
                  value={
                    formData?.aws_region.length > 0
                      ? {
                          label: formData.aws_region,
                          value: formData.aws_region
                        }
                      : null
                  }
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="sns_access_key_id">
                  Pinpoint App ID
                </label>
                <input
                  className="modal_input"
                  placeholder="Pinpoint App ID"
                  name="pinpoint_application_id"
                  id="pinpoint_application_id"
                  value={formData?.pinpoint_application_id}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="sns_access_key_id">
                  Sender Phone Number
                </label>
                <input
                  className="modal_input"
                  placeholder="Phone Number"
                  name="sender_phone_number"
                  id="sender_phone_number_id"
                  value={formData?.sender_phone_number}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal_footer" data-cy="connectPinpoint">
          <ModalButton onClick={connect} isLoading={isSubmitting}>
            {isReconfigure ? 'Reconfigure' : 'Connect'}
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

AddAmazonPinpointSMS.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  isReconfigure: PropTypes.bool,
  setIsReconfigure: PropTypes.func,
  isOnboarding: PropTypes.bool,
  setIsSkip: PropTypes.func
};

export default AddAmazonPinpointSMS;
