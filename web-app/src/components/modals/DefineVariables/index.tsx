import { useNotification } from '../../../Notifications/NotificationProvider';
import { useEffect, useRef, useState } from 'react';

import Select from 'react-select';
import { ModalButton } from '../../library/button';
import { Switch } from '../../library/switch';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { customStyles } from '../../../styles/styled-selectors';

interface PrimaryVarsFields {
  table_type: string;
  variable_name: string;
  column_index: string;
  state: string;
}

const DefineVariables = (props: any) => {
  const { closeModal, open } = props;

  const {
    event,
    foreign_key_column: foreignKeyColumn,
    schema_name: schemaName,
    table_name: tableName
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const { schema_name: userSchemaName, table_name: userTableName } =
    useSelector((state: RootState) => state.user_table);
  const columnsBySchemaAndTable = useSelector(
    (state: RootState) => state.columns
  );

  const dispatch = useDispatch();

  const columnList: any = columnsBySchemaAndTable[`${schemaName}$${tableName}`];

  const userColumnList: any =
    columnsBySchemaAndTable[`${userSchemaName}$${userTableName}`];

  useEffect(() => {
    if (!columnList && schemaName !== '' && tableName !== '') {
      dispatch.columns.getColumns({
        schema_name: schemaName,
        table_name: tableName
      });
    }
    if (!userColumnList && userSchemaName !== '' && userTableName !== '') {
      dispatch.columns.getColumns({
        schema_name: userSchemaName,
        table_name: userTableName
      });
    }
  }, []);

  const [primaryVariablesForm, setPrimaryVariablesForm] = useState([
    {
      table_type: '',
      variable_name: '',
      column_index: '',
      state: event === 'DELETE' ? 'old' : 'new'
    }
  ]);

  const handleFormData = (e: any, idx: number) => {
    let form: any = [...primaryVariablesForm];
    form[idx][e.target.name] = e.target.value;
    setPrimaryVariablesForm(form);
  };

  const handleFormDropDown = (e: any, idx: number) => {
    let form = [...primaryVariablesForm];
    form[idx]['column_index'] = e.value;
    setPrimaryVariablesForm(form);
  };

  const handleTableType = (e: any, idx: number) => {
    let form = [...primaryVariablesForm];
    form[idx]['table_type'] = e.value;
    setPrimaryVariablesForm(form);
  };

  const handleFormToggle = (e: any, idx: number) => {
    let form = [...primaryVariablesForm];
    form[idx]['state'] = e.target.checked ? 'new' : 'old';
    setPrimaryVariablesForm(form);
  };

  const addFormField = () => {
    const newField = {
      table_type: '',
      variable_name: '',
      column_index: '',
      state: event === 'DELETE' ? 'old' : 'new'
    };

    setPrimaryVariablesForm([...primaryVariablesForm, newField]);
  };

  useEffect(() => {
    formRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'end'
    });
  }, [primaryVariablesForm.length]);

  const deleteFormField = (idx: number) => {
    let formData = [...primaryVariablesForm];
    formData = formData.filter((content: any, index: number) => index !== idx);
    setPrimaryVariablesForm(formData);
  };

  const notification = useNotification();
  const notificationID = 'primaryVariableDanger';

  const formRef = useRef<HTMLDivElement>(null);

  const validateFormFields = () => {
    let validationStatus = true;
    primaryVariablesForm.forEach((formFields: any) => {
      if (formFields.variable_name === '' || formFields.column_index === '') {
        validationStatus = false;
      }
    });
    return validationStatus;
  };

  const submitprimaryVariablesForm = (event: any) => {
    event.preventDefault();
    const validationStatus = validateFormFields();
    if (!validationStatus) {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: `Incomplete Fields`,
          status: 'danger',
          description: 'Please fill or remove empty fields'
        });
      }
      return;
    }

    dispatch.trigger_drafts.addPrimaryVariables({
      primaryVariablesForm,
      columnList,
      userColumnList
    });

    setPrimaryVariablesForm([
      {
        table_type: 'trigger_table',
        variable_name: '',
        column_index: '',
        state: event === 'DELETE' ? 'old' : 'new'
      }
    ]);
    closeModal();
  };

  useEffect(() => {
    console.log('Primary variables', JSON.stringify(primaryVariablesForm));
  }, [primaryVariablesForm]);

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Define Variables</p>
          <img
            src="/icons/cross_black.svg"
            className="cursor-pointer"
            onClick={closeModal}
            data-cy="closeDV"
          />
        </div>
        <div className="modal_content my-0 h-[45vh] min-w-[40vw] overflow-auto">
          <div className="v_stack relative">
            {primaryVariablesForm.map((ele: PrimaryVarsFields, idx: number) => (
              <div key={idx} className="relative mt-8 pl-12">
                <div className="h_stack absolute left-1 top-1 h-9 w-9 rounded-full bg-empty3 p-5 text-lg font-bold">
                  {idx + 1}
                </div>
                <div className="w-full rounded-lg bg-empty3 py-4 px-8">
                  <form>
                    <div className="h_stack mb-1.5">
                      <label className="input_label pr-1" htmlFor="schema">
                        Table Type
                      </label>
                      <Select
                        placeholder="Select Table Type"
                        options={
                          foreignKeyColumn !== ''
                            ? [
                                {
                                  label: `Trigger Table(${tableName})`,
                                  value: 'trigger_table'
                                },
                                {
                                  label: `User Table(${userTableName})`,
                                  value: 'user_table'
                                }
                              ]
                            : [
                                {
                                  label: `Trigger Table(${tableName})`,
                                  value: 'trigger_table'
                                }
                              ]
                        }
                        onChange={e => handleTableType(e, idx)}
                        styles={customStyles}
                        name="type"
                        id="table_type"
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div className="h_stack mb-1.5">
                      <label className="input_label" htmlFor="variable_name">
                        New Variable Name
                      </label>
                      <input
                        type="text"
                        className="modal_input bg-white"
                        placeholder="Variable Name"
                        name="variable_name"
                        id="variable_name"
                        value={ele.variable_name}
                        autoComplete="off"
                        onChange={(e: any) => handleFormData(e, idx)}
                        required
                        autoFocus={idx === 0}
                        data-cy="varName"
                      />
                    </div>
                    <div className="h_stack mb-1.5">
                      <label
                        className="input_label pr-1"
                        htmlFor="column_index"
                      >
                        Value
                      </label>
                      <Select
                        placeholder="Select Column Name"
                        options={
                          ele.table_type === 'trigger_table'
                            ? columnList
                            : userColumnList
                        }
                        isDisabled={
                          primaryVariablesForm[`${idx}`].table_type.length === 0
                        }
                        onChange={e => handleFormDropDown(e, idx)}
                        styles={customStyles}
                        name="column_index"
                        id="column_index"
                        isLoading={
                          ele.table_type === 'trigger_table'
                            ? !columnList
                            : !userColumnList
                        }
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div className="h_stack mt-5 justify-end">
                      {event === 'UPDATE' && (
                        <>
                          <label className="pr-3 text-sm">
                            Use New Value ?
                          </label>
                          <Switch
                            checked={ele.state == 'new'}
                            onChange={(e: any) => handleFormToggle(e, idx)}
                          ></Switch>
                        </>
                      )}
                      <img
                        src="/icons/trash_bin.svg"
                        alt="delete"
                        className="ml-4 h-5 cursor-pointer"
                        onClick={() => deleteFormField(idx)}
                        data-cy="deleteBtn"
                      />
                    </div>
                  </form>
                </div>
              </div>
            ))}
            <div ref={formRef} />
          </div>
        </div>
        <div className="modal_footer justify-between" data-cy="addVariables">
          <div
            className="cursor-pointer rounded-full bg-red2 p-2.5"
            onClick={addFormField}
            data-cy="addBtn"
          >
            <img
              src="/icons/add-white.svg"
              alt="add"
              className="cursor-pointer"
            />
          </div>
          <ModalButton onClick={submitprimaryVariablesForm}>Submit</ModalButton>
        </div>
      </div>
    </div>
  );
};

DefineVariables.propTypes = {
  closeModal: PropTypes.func,
  open: PropTypes.bool
};

export default DefineVariables;
