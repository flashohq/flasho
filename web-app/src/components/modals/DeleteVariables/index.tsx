import { ModalRedButton } from '../../library/button';
import PropTypes from 'prop-types';

const DeleteVariables = (props: any) => {
  const {
    open,
    closeModal,
    confirmAction,
    dependentVariables,
    currentDeleteVariable
  } = props;

  const handleConfirm = () => {
    confirmAction([...dependentVariables, currentDeleteVariable]);
    closeModal();
  };
  return (
    <>
      {dependentVariables.length === 0 && (
        <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
          <div className="modal_container min-w-[30vw]">
            <div className="modal_header">
              <p className="px-5 text-xl font-normal">
                Are you sure want to delete{' '}
                <span className="font-semibold">{currentDeleteVariable}</span> ?
              </p>
              <img
                src="/icons/cross_black.svg"
                className="ml-10 cursor-pointer"
                onClick={closeModal}
              />
            </div>
            <div className="modal_content">
              <p className="text-red2">
                * You won't be able to use{' '}
                <span className="font-semibold">{currentDeleteVariable}</span>{' '}
                again.
              </p>
            </div>
            <div className="modal_footer">
              <ModalRedButton onClick={handleConfirm}>Delete</ModalRedButton>
            </div>
          </div>
        </div>
      )}
      {dependentVariables.length !== 0 && (
        <div className={`modal_body ${open ? 'fixed' : 'hidden'} `}>
          <div className="modal_container min-w-[35vw] max-w-[50vw]">
            <div className="modal_header">
              <p className="modal_title">
                Are you sure want to delete{' '}
                <span className="font-semibold">{currentDeleteVariable}</span> ?
              </p>
              <img
                src="/icons/cross_black.svg"
                className="ml-10 cursor-pointer"
                onClick={closeModal}
              />
            </div>
            <div className="modal_content">
              <p className="pl-1">
                Following variables are dependent on {currentDeleteVariable} :
              </p>
              <div className="my-4 max-h-52 overflow-y-auto rounded-md bg-[#e2e8f0] py-1 px-2">
                {dependentVariables.map((content: any) => (
                  <div className=" m-1 inline-block rounded-md bg-[#3182ce] py-2 px-4 text-lg text-[#f1faee]">
                    {content}
                  </div>
                ))}
              </div>
              <p className=" text-red2">
                * Deleting this variable will also delete all its dependent
                variables.
              </p>
            </div>
            <div className="modal_footer">
              <ModalRedButton onClick={handleConfirm}>Delete</ModalRedButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

DeleteVariables.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  confirmAction: PropTypes.func,
  dependentVariables: PropTypes.arrayOf(PropTypes.string),
  currentDeleteVariable: PropTypes.string
};

export default DeleteVariables;
