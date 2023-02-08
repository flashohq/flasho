import { ModalRedButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

const DeleteTrigger = (props: any) => {
  const dispatch = useDispatch();
  const { open, closeModal, id, type, isLoading } = props;

  const handleConfirm = async () => {
    await dispatch.triggers.remove_trigger({ id, type });
    closeModal();
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container min-w-[30vw]">
        <div className="modal_header">
          <p className="px-5 text-xl font-normal">
            Are you sure you want to delete this trigger?
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="modal_content">
          <p className={'text-lg text-red2'}>
            You will be permanently deleting this trigger.
          </p>
        </div>
        <div className="modal_footer">
          <ModalRedButton onClick={handleConfirm} isLoading={isLoading}>
            Delete
          </ModalRedButton>
        </div>
      </div>
    </div>
  );
};
DeleteTrigger.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  isLoading: PropTypes.bool
};

export default DeleteTrigger;
