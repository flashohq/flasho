import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const InsertVariables = (props: any) => {
  const { open, closeModal, addVariableToTextField } = props;

  const {
    configuration: {
      variables: {
        primary: primaryVariables,
        derived: derivedVariables,
        manual: manualVariables
      }
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const dispatch = useDispatch();

  const variables = [
    ...manualVariables,
    ...Object.keys(primaryVariables),
    ...Object.keys(derivedVariables)
  ];

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container min-w-[35vw]">
        <div className="modal_header">
          <p className="modal_title">Insert Variables</p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
            data-cy="closeIV"
          />
        </div>
        <div className="modal_content">
          <div className="max-h-[20vh] w-full overflow-y-auto">
            {variables.length === 0 && (
              <p>
                No variables are present. Create new variables to use this
                functionality.
              </p>
            )}
            {variables.length !== 0 &&
              variables.map((variableName: string) => {
                console.log('Vars to insert', variableName);
                return (
                  <div
                    className="cursor-pointer rounded py-2 px-3 hover:bg-[#A8DADC]"
                    onClick={() => {
                      addVariableToTextField(variableName);
                      closeModal();
                    }}
                  >
                    {variableName}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="modal_footer">
          <button
            className=" rounded-lg bg-inherit px-4 pt-1 pb-4 font-bold text-[#ff4772] hover:bg-[#dfdfdf]"
            onClick={() =>
              dispatch.trigger_drafts.updateValue({
                key: 'activeTab',
                value: 'Variables'
              })
            }
          >
            <div className="relative top-2.5 mr-2 inline-block rounded-full bg-[#ff4772] p-1">
              <img
                src="/icons/add-white.svg"
                alt="add"
                className="cursor-pointer"
              />
            </div>
            Create New Variables
          </button>
        </div>
      </div>
    </div>
  );
};

InsertVariables.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  addVariableToTextField: PropTypes.func
};

export default InsertVariables;
