import { ModalButton, ModalButtonDisabled } from '../../library/button';
import PropTypes from 'prop-types';

const SendEmail = (props: any) => {
  const { open, closeModal, submit, submitLoading, submitDisabled } = props;

  return (
    <div className={` modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Are you sure you want to continue?</p>
          <img
            src="/icons/cross_black.svg"
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="modal_content my-5 px-9">
          <p className="py-2">
            This e-mail will be sent to everyone in the selected audience.
          </p>
        </div>
        <div className="modal_footer">
          {submitDisabled && <ModalButtonDisabled>Confirm</ModalButtonDisabled>}
          {!submitDisabled && (
            <ModalButton onClick={submit} isLoading={submitLoading}>
              Confirm
            </ModalButton>
          )}
        </div>
      </div>
    </div>
  );
};

SendEmail.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  submit: PropTypes.func,
  submitLoading: PropTypes.bool,
  submitDisabled: PropTypes.bool
};

export default SendEmail;
