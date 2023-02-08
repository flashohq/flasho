import { ModalRedButton } from '../../library/button';
import { ModalGreenButton } from '../../library/button';
import PropTypes from 'prop-types';
import { SERVICE_NAMES, SERVICES_LABELS } from '../DeleteService';

import { useDispatch } from 'react-redux';

const ToggleConnection = (props: any) => {
  const dispatch = useDispatch();
  const { open, closeModal, serviceName, activate } = props;

  const handleConfirm = async () => {
    await dispatch.integrations.TOGGLE_INTEGRATION(serviceName);
    closeModal();
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container min-w-[30vw]">
        <div className="modal_header">
          <p className="px-5 text-xl font-normal">
            {activate === true
              ? 'This service will be Deactivated'
              : 'This service will be Activated'}
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="modal_content">
          <p
            className={`text-lg ${
              activate === true ? 'text-red2' : 'text-darkgreen'
            }`}
          >
            Are you sure you want to{' '}
            {activate === true ? 'deactivate' : 'activate'}{' '}
            <span className="font-semibold">
              {SERVICE_NAMES[serviceName as keyof SERVICES_LABELS]}
            </span>
            ?
          </p>
        </div>
        <div className="modal_footer">
          {activate === true ? (
            <ModalRedButton onClick={handleConfirm}>Deactivate</ModalRedButton>
          ) : (
            <ModalGreenButton onClick={handleConfirm}>
              Activate
            </ModalGreenButton>
          )}
        </div>
      </div>
    </div>
  );
};
ToggleConnection.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  serviceName: PropTypes.string,
  activate: PropTypes.bool
};

export default ToggleConnection;
