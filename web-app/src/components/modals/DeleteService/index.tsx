import { ModalRedButton } from '../../library/button';
import PropTypes from 'prop-types';

export interface SERVICES_LABELS {
  postgres: string;
  ses: string;
  sns: string;
  pinpoint_sms: string;
  pinpoint_email: string;
  twilio: string;
  twilio_sendgrid: string;
}

export const SERVICE_NAMES: SERVICES_LABELS = {
  postgres: 'Postgres',
  ses: 'SES',
  sns: 'SNS',
  pinpoint_sms: 'Pinpoint SMS',
  pinpoint_email: 'Pinpoint Email',
  twilio: 'Twilio',
  twilio_sendgrid: 'SendGrid'
};

import { useDispatch } from 'react-redux';

const DeleteService = (props: any) => {
  const dispatch = useDispatch();
  const { open, closeModal, serviceName } = props;

  const handleConfirm = async () => {
    await dispatch.integrations.DELETE_INTEGRATION(serviceName);
    closeModal();
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container min-w-[30vw]">
        <div className="modal_header">
          <p className="px-5 text-xl font-normal">
            Are you sure you want to delete this connection?
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="modal_content">
          <p className={'text-lg text-red2'}>
            You will be permanently deleting the credentials and can only <br />
            connect{' '}
            <span className="font-semibold">
              {SERVICE_NAMES[serviceName as keyof SERVICES_LABELS]}
            </span>{' '}
            again by using the Add New Connection option.
          </p>
        </div>
        <div className="modal_footer">
          <ModalRedButton onClick={handleConfirm}>Delete</ModalRedButton>
        </div>
      </div>
    </div>
  );
};
DeleteService.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  serviceName: PropTypes.string
};

export default DeleteService;
