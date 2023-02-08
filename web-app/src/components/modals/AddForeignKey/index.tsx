import axiosInstance from '../../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { ModalButton, ModalButtonDisabled } from '../../library/button';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { customStyles } from '../../../styles/styled-selectors';

const AddForeignKey = (props: any) => {
  const { open, closeModal } = props;

  const dispatch = useDispatch();
  const userTable = useSelector((state: RootState) => state.user_table);
  const {
    schema_name: schemaName,
    table_name: tableName,
    foreign_key_column: foreignKeyColumn
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const columnsBySchemaAndTable = useSelector(
    (state: RootState) => state.columns
  );
  const columnList: any = columnsBySchemaAndTable[`${schemaName}$${tableName}`];

  const [foreignKey, setForeignKey] = useState('');
  const [checkingIfJoinIsPossible, setCheckingIfJoinPosibble] = useState(false);
  const [isJoinPossible, setIsJoinPossible] = useState(false);

  useEffect(() => {
    if (!columnList) {
      dispatch.columns.getColumns({
        schema_name: schemaName,
        table_name: tableName
      });
    }
  }, []);

  useEffect(() => {
    if (foreignKey === '') {
      return;
    }

    setCheckingIfJoinPosibble(true);
    axiosInstance
      .post('/v1/settings/check_join_possible', {
        user_table: userTable.table_name,
        current_table: tableName,
        primary_key_column: userTable.primary_key_column,
        foreign_key_column: foreignKey
      })
      .then(data => {
        setCheckingIfJoinPosibble(false);
        setIsJoinPossible(true);
      })
      .catch(err => {
        setCheckingIfJoinPosibble(false);
        setIsJoinPossible(false);
        console.log(err);
      });
  }, [foreignKey]);

  const submit = () => {
    dispatch.trigger_drafts.updateValue({
      key: 'foreign_key_column',
      value: foreignKey
    });
    closeModal();
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Add Foreign Key</p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
            data-cy="closeFK"
          />
        </div>
        <div className="modal_content relative">
          <form>
            <div className="v_stack">
              <div className="h_stack mb-1.5">
                <label className="input_label w-24" htmlFor="usertable_name">
                  User Table
                </label>
                <input
                  className="modal_input_disabled mr-9"
                  value={userTable?.table_name}
                  id="usertable_name"
                  disabled
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label w-24" htmlFor="triggertable_name">
                  Trigger Table
                </label>
                <input
                  id="triggertable_name"
                  className="modal_input_disabled mr-9"
                  value={tableName}
                  disabled
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label w-24 pr-1" htmlFor="foreign_key">
                  Foreign Key
                </label>
                <Select
                  id="foreign_key"
                  menuPortalTarget={document.body}
                  placeholder="Select Column"
                  styles={customStyles}
                  options={columnList}
                  value={
                    foreignKeyColumn
                      ? {
                          value: foreignKeyColumn,
                          label: foreignKeyColumn
                        }
                      : {
                          value: foreignKey,
                          label: foreignKey
                        }
                  }
                  isLoading={!columnList}
                  onChange={(event: any) => setForeignKey(event.label)}
                />
                <div className="h_stack h-full w-8">
                  {checkingIfJoinIsPossible ? (
                    <img src="/icons/spinner_blue.svg" alt="Loading" />
                  ) : isJoinPossible ? (
                    <img src="/icons/processed.svg" alt="success" />
                  ) : (
                    foreignKey.length > 0 && (
                      <>
                        <img
                          onMouseEnter={() =>
                            document
                              .getElementById('tooltip')
                              ?.classList.remove('hidden')
                          }
                          onMouseLeave={() =>
                            document
                              .getElementById('tooltip')
                              ?.classList.add('hidden')
                          }
                          src="/icons/failed.svg"
                          alt="failed"
                        />
                        <div
                          id="tooltip"
                          className="absolute -right-[8.3rem] hidden rounded bg-black bg-opacity-90 px-2 py-0.5 text-sm text-white"
                        >
                          Please select valid column
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal_footer">
          {!isJoinPossible && <ModalButtonDisabled>Done</ModalButtonDisabled>}
          {isJoinPossible && <ModalButton onClick={submit}>Done</ModalButton>}
        </div>
      </div>
    </div>
  );
};

AddForeignKey.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func
};

export default AddForeignKey;
