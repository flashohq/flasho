import { useNotification } from '../../../Notifications/NotificationProvider';
import React, { useEffect, useState } from 'react';
import makeAnimated from 'react-select/animated';
import axiosInstance from '../../../utils/axiosInstance';
import { ModalButton } from '../../library/button';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  SERVICE_TYPES,
  SES_CREDENTIALS
} from '../../../redux/types/credentials';
import { customStyles } from '../../../styles/styled-selectors';

const animatedComponents = makeAnimated();

const defaultFormData = {
  aws_access_key_id: '',
  aws_secret_access_key: '',
  aws_region: '',
  source_email_address: ''
};

const AddAmazonSES = (props: any) => {
  const { open, closeModal, isReconfigure, setIsReconfigure, isOnboarding } =
    props;
  const notification = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const credentials = useSelector((state: RootState) => state.credentials);
  const dispatch = useDispatch();

  const connect = () => {
    setIsSubmitting(true);
    axiosInstance
      .post('/v1/settings/initialize_ses', formData)
      .then(() => {
        notification({
          title: `Amazon SES ${isReconfigure ? 'Reconfigured' : 'Connected'}`,
          description: `Amazon SES is ${
            isReconfigure ? 'reconfigured' : 'connected'
          } successfully`,
          status: 'success'
        });
        dispatch.integrations.LOAD_CONFIG();
        dispatch.credentials.ADD_CREDENTIALS({
          service_name: SERVICE_TYPES.SES,
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

  const [formData, setFormData] = useState<SES_CREDENTIALS>({
    aws_access_key_id: '',
    aws_secret_access_key: '',
    aws_region: '',
    source_email_address: ''
  });

  useEffect(() => {
    if (isReconfigure && open && !isOnboarding) {
      //console.log('SES Credentials', JSON.stringify(credentials['ses']));
      dispatch.credentials.LOAD_CREDENTIALS('ses');
      setFormData(credentials['ses'] as SES_CREDENTIALS);
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
            {isReconfigure ? 'Reconfigure' : 'Connect'} your Amazon SES
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
            data-cy="closeSES"
          />
        </div>
        <div className="modal_content">
          <form>
            <div className="v_stack">
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="ses_access_key_id">
                  Access Key ID
                </label>
                <input
                  className="modal_input"
                  placeholder="Access Key"
                  name="aws_access_key_id"
                  id="ses_access_key_id"
                  value={formData.aws_access_key_id}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="ses_secret_access_key">
                  Secret Access Key
                </label>
                <input
                  className="modal_input"
                  placeholder="Secret Key"
                  name="aws_secret_access_key"
                  id="ses_secret_access_key"
                  value={formData.aws_secret_access_key}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label pr-1" htmlFor="ses_aws_region">
                  Region
                </label>
                <Select
                  id="ses_aws_region"
                  placeholder="Select Region"
                  components={animatedComponents}
                  options={region}
                  onChange={handleRegion}
                  styles={customStyles}
                  value={
                    formData.aws_region.length > 0
                      ? {
                          label: formData.aws_region,
                          value: formData.aws_region
                        }
                      : null
                  }
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label" htmlFor="email_address">
                  Source Email Address
                </label>
                <input
                  className="modal_input"
                  placeholder="Email"
                  name="source_email_address"
                  id="email_address"
                  value={formData.source_email_address}
                  autoComplete={'off'}
                  onChange={handleFormData}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal_footer" data-cy="connectSES">
          <ModalButton onClick={connect} isLoading={isSubmitting}>
            {isReconfigure ? 'Reconfigure' : 'Connect'}
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

AddAmazonSES.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  isReconfigure: PropTypes.bool,
  setIsReconfigure: PropTypes.func,
  isOnboarding: PropTypes.bool,
  setIsSkip: PropTypes.func
};

export default AddAmazonSES;
