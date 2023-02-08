import { useNotification } from '../../../Notifications/NotificationProvider';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { Button, ButtonLG, IconButton } from '../../library/button';

import Tags from '../../library/tags';
import DeleteVariables from '../../modals/DeleteVariables';
import AddUserTable from '../../modals/AddUserTable';
import AddForeignKey from '../../modals/AddForeignKey';
import DefineVariables from '../../modals/DefineVariables';
import DefineDerivedVariables from '../../modals/DefineDerivedVariables';

const customStyles = {
  menuList: (base: any) => ({ ...base, maxHeight: 150, overflowY: 'auto' }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: '#0e1c36',
    background: state.isFocused ? '#E9ECEF' : '#fff'
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
  menu: (provided: any, state: any) => ({
    ...provided
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    width: '20rem'
  })
};

const Variables = (props: any) => {
  const { isEdit } = props;

  const dispatch = useDispatch();

  const {
    schema_name: schemaName,
    table_name: tableName,
    foreign_key_column: foreignKeyColumn,
    event,
    configuration: {
      variables: { primary: primaryVariables, derived: derivedVariables }
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  console.log({ foreignKeyColumn });
  const userTable = useSelector((state: RootState) => state.user_table);

  console.log({ userTable });
  const schemaList = useSelector((state: RootState) => state.schemas);
  const tablesBySchemaName = useSelector((state: RootState) => state.tables);
  const tableList = tablesBySchemaName[schemaName];

  const toast = useNotification();
  const toastId = 'tableNameError';

  const goToNext = () => {
    if (tableName.length == 0) {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: `Table not selected`,
          status: 'danger'
        });
      }
    } else {
      dispatch.trigger_drafts.updateValue({
        key: 'activeTab',
        value: 'Conditions'
      });
    }
  };

  const [dependentVariables, setDependentVariables] = useState<Array<string>>(
    []
  );
  const [currentDeleteVariable, setCurrentDeleteVariable] =
    useState<string>('');
  const [addVariables, setAddVariables] = useState<boolean>(false);
  const [addDerivedVariables, setAddDerivedVariables] =
    useState<boolean>(false);
  const [addForeignKeyAcc, setAddForeignKeyAcc] = useState<boolean>(true);
  const [userTableModal, setUserTableModal] = useState<boolean>(false);
  const [deleteVariablesModal, setDeleteVariablesModal] =
    useState<boolean>(false);
  const [foreignKeyModal, setForeignKeyModal] = useState<boolean>(false);

  const handleTableChange = (event: any) => {
    dispatch.trigger_drafts.updateValue({
      key: 'table_name',
      value: event.value
    });
    dispatch.trigger_drafts.updateVariables({ variables: [], type: 'primary' });
    dispatch.trigger_drafts.updateVariables({ variables: [], type: 'derived' });
    setDependentVariables([]);
  };

  const handleSchemaChange = (event: any) => {
    dispatch.trigger_drafts.updateValue({
      key: 'schema_name',
      value: event.value
    });
    dispatch.trigger_drafts.updateValue({ key: 'table_name', value: '' });
  };

  const getDependedVariables = (variableName: string) => {
    let dependedVariables: Array<string> = Object.keys(derivedVariables).filter(
      currVariable =>
        derivedVariables[currVariable].variable1 == variableName ||
        derivedVariables[currVariable].variable2 == variableName
    );

    let nestedDependedVariables: Array<string> = [];

    dependedVariables.forEach((dependedVariableName: string) => {
      nestedDependedVariables = [
        ...nestedDependedVariables,
        ...getDependedVariables(dependedVariableName)
      ];
    });

    dependedVariables = [
      //@ts-ignore
      ...new Set([...dependedVariables, ...nestedDependedVariables])
    ];

    return dependedVariables;
  };

  const handleDeleteVariable = (variableName: string, type: string) => {
    let dependedVariables = getDependedVariables(variableName);

    if (dependedVariables.length > 0) {
      //open warning modal with depended variables list
      setDependentVariables(dependedVariables);
      setCurrentDeleteVariable(variableName);
      setDeleteVariablesModal(true);
    } else {
      setDependentVariables([]);
      setCurrentDeleteVariable(variableName);
      setDeleteVariablesModal(true);
    }
  };

  useEffect(() => {
    if (schemaList.length == 0) {
      dispatch.schemas.getSchemaList();
    }
    if (Object.keys(userTable).length) {
      dispatch.user_table.getUserTable();
    }
  }, []);

  useEffect(() => {
    if (schemaName !== '' && !tablesBySchemaName[schemaName]) {
      dispatch.tables.getTables(schemaName);
    }
  }, [schemaName]);

  useEffect(() => {
    if (foreignKeyColumn?.length !== 0) {
      setAddForeignKeyAcc(false);
    }
  }, [foreignKeyColumn]);

  return (
    <>
      {userTableModal && (
        <AddUserTable
          open={userTableModal}
          closeModal={() => setUserTableModal(false)}
        />
      )}
      {addVariables && (
        <DefineVariables
          open={addVariables}
          closeModal={() => setAddVariables(false)}
        />
      )}
      {addDerivedVariables && (
        <DefineDerivedVariables
          open={addDerivedVariables}
          closeModal={() => setAddDerivedVariables(false)}
        />
      )}
      <DeleteVariables
        open={deleteVariablesModal}
        dependentVariables={dependentVariables}
        currentDeleteVariable={currentDeleteVariable}
        closeModal={() => setDeleteVariablesModal(false)}
        confirmAction={variables => {
          dispatch.trigger_drafts.deleteVariables({ variables });
        }}
      />
      {foreignKeyModal && (
        <AddForeignKey
          open={foreignKeyModal}
          closeModal={() => setForeignKeyModal(false)}
        />
      )}
      <div className="h-full w-full flex-grow bg-white">
        <div className="step_container pb-20">
          <section className="step_header">
            <h2>
              Select the table where the new row will be{' '}
              {event === 'INSERT'
                ? 'inserted'
                : event === 'DELETE'
                ? 'deleted'
                : 'updated'}
            </h2>
          </section>
          <section>
            <div className="flex items-center justify-center">
              <div className="mr-8 flex flex-col items-center py-8">
                <p className="mb-4 select-none text-lg font-medium text-black">
                  Schema
                </p>
                <Select
                  placeholder="Select Schema Name"
                  options={schemaList}
                  onChange={handleSchemaChange}
                  styles={customStyles}
                  value={
                    schemaName == ''
                      ? { label: 'Select schema', value: '' }
                      : { label: schemaName, value: schemaName }
                  }
                  isLoading={schemaList.length == 0}
                  isDisabled={isEdit}
                />
              </div>
              <div className="ml-8 flex flex-col items-center py-8">
                <p className="mb-4 select-none text-lg font-medium text-black">
                  Table Name
                </p>
                <Select
                  placeholder="Select table Name"
                  options={tableList}
                  onChange={handleTableChange}
                  styles={customStyles}
                  value={
                    tableName == ''
                      ? { label: 'Select table Name', value: '' }
                      : { label: tableName, value: tableName }
                  }
                  isLoading={
                    !tableList && schemaName !== '' && tableName === ''
                  }
                  isDisabled={isEdit}
                />
              </div>
            </div>
            {tableName !== '' && (
              <div className="mb-1">
                <section
                  className="step_header"
                  onClick={() =>
                    !foreignKeyColumn && setAddForeignKeyAcc(!addForeignKeyAcc)
                  }
                >
                  <h2>Add foreign key for user table</h2>
                  {foreignKeyColumn && (
                    <img
                      src="/icons/key_icon.svg"
                      className="ml-4"
                      alt="success"
                      onClick={() => setForeignKeyModal(true)}
                    />
                  )}
                </section>
                {addForeignKeyAcc && (
                  <div className="flex h-36 w-full items-center justify-center">
                    {Object.keys(userTable).length === 0 && (
                      <div className="flex w-64 flex-col justify-center">
                        <p className="mt-4 mb-4 flex items-center justify-center text-red">
                          <img
                            src={'/icons/warning-icon.svg'}
                            className={'mr-2 h-6 w-6 object-contain'}
                          />
                          User Table not found
                        </p>
                        <Button
                          text={'Add User table'}
                          onClick={() => setUserTableModal(true)}
                        />
                      </div>
                    )}
                    {Object.keys(userTable).length === 0 && (
                      <div className="h-8 w-full" />
                    )}
                    {Object.keys(userTable).length !== 0 &&
                      (foreignKeyColumn === '' || !foreignKeyColumn) && (
                        <div className="flex items-center justify-center">
                          <button
                            className="flex cursor-pointer items-center justify-center rounded-md border-2 border-blue px-4 py-2 shadow-lg hover:shadow"
                            onClick={() => setForeignKeyModal(true)}
                          >
                            <p className="text-lg font-medium text-blue">
                              Add Foreign Key{' '}
                            </p>
                            <img
                              src={'/icons/key_icon.svg'}
                              className={
                                'ml-2 h-6 w-6 cursor-pointer object-contain'
                              }
                            />
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
            {tableName !== '' && (
              <div>
                <section className="step_header">
                  <h2>Select the variables that you'd want to monitor</h2>
                </section>
                <section className="flex w-full items-center justify-center py-6">
                  <IconButton
                    icon={'/icons/plus.svg'}
                    text={'Add Variables'}
                    style={'w-72 border-red mr-8'}
                    iconStyle={'h-5 w-5 object-contain mr-3'}
                    textStyle={'text-red'}
                    onClick={() => setAddVariables(true)}
                  />
                  <IconButton
                    icon={'/icons/plus.svg'}
                    text={'Add Derived Variables'}
                    iconStyle={'h-5 w-5 object-contain mr-3'}
                    style={'w-72 border-red'}
                    textStyle={'text-red'}
                    onClick={() => setAddDerivedVariables(true)}
                  />
                </section>
              </div>
            )}
            {(Object.keys(primaryVariables).length !== 0 ||
              Object.keys(derivedVariables).length !== 0) && (
              <div className="mx-auto mt-4 mb-4 flex max-h-[250px]  w-11/12 justify-center rounded bg-empty3 p-3">
                {Object.keys(primaryVariables).map((variableName: string) => (
                  <Tags
                    text={variableName}
                    style={'bg-teal hover:bg-tealDark'}
                    onClick={() =>
                      handleDeleteVariable(variableName, 'primary')
                    }
                  />
                ))}
                {Object.keys(derivedVariables).map((variableName: string) => (
                  <Tags
                    text={variableName}
                    style={'bg-blueTag hover:bg-blueDarkTag'}
                    onClick={() =>
                      handleDeleteVariable(variableName, 'derived')
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
        <section className="absolute bottom-0 flex h-16 w-4/5 items-center justify-center bg-white">
          <ButtonLG
            text={'Next'}
            onClick={goToNext}
            isDisabled={!isEdit && tableName.length === 0}
            style={'px-20 w-56'}
          />
        </section>
      </div>
    </>
  );
};

Variables.propTypes = {
  isEdit: PropTypes.bool
};

export default Variables;
