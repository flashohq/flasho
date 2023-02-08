import Select from 'react-select';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const customStyles = {
  menuList: (base: any) => ({ ...base, maxHeight: 150, overflowY: 'auto' }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
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
  container: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 8,
    width: '20rem'
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 8,
    width: '20rem',
    height: '2.25rem'
  })
};

export const UserTableForm = () => {
  const dispatch = useDispatch();
  const schemaList = useSelector((state: RootState) => state.schemas);
  const tablesBySchema = useSelector((state: RootState) => state.tables);
  const columnsBySchemaAndTable = useSelector(
    (state: RootState) => state.columns
  );
  const {
    schema_name: schemaName,
    table_name: tableName,
    primary_key_column: primaryKeyColumn
  } = useSelector((state: RootState) => state.user_table);

  const tableList: any = tablesBySchema[schemaName];
  const columnList: any = columnsBySchemaAndTable[`${schemaName}$${tableName}`];

  // Change Handler for schema Select
  const handleSchemaChange = (event: any) => {
    dispatch.user_table.setValue({
      key: 'schema_name',
      value: event.value
    });
  };

  // Change Handler for table Select
  const handleTableChange = (event: any) => {
    dispatch.user_table.setValue({
      key: 'table_name',
      value: event.value
    });
  };

  // Change Handler for primary key Select
  const handleColumnChange = (event: any) => {
    dispatch.user_table.setValue({
      key: 'primary_key_column',
      value: columnList[event.value].label
    });
  };

  useEffect(() => {
    if (schemaList.length === 0) {
      dispatch.schemas.getSchemaList();
    }
  }, []);

  useEffect(() => {
    if (schemaName !== '') {
      dispatch.user_table.setValue({ key: 'table_name', value: '' });
      dispatch.user_table.setValue({ key: 'primary_key_column', value: '' });
    }
    if (schemaName) {
      if (!tableList) dispatch.tables.getTables(schemaName);
    }
  }, [schemaName]);

  useEffect(() => {
    dispatch.user_table.setValue({ key: 'primary_key_column', value: '' });
    if (tableName === '' || !tableName) {
      return;
    }
    dispatch.columns.getColumns({
      schema_name: schemaName,
      table_name: tableName
    });
  }, [tableName]);

  return (
    <div className="mt-8 flex w-full flex-col items-center">
      <h2 className="mb-4 text-xl font-semibold text-blue">Schema</h2>
      <div className="mb-4 flex items-center justify-center">
        <Select
          placeholder="Select schema"
          options={schemaList}
          value={
            !schemaName
              ? { label: 'Select schema', value: '' }
              : { label: schemaName, value: schemaName }
          }
          onChange={handleSchemaChange}
          styles={customStyles}
          name={'schema_name'}
          isLoading={schemaList.length === 0}
        />
      </div>
      <h2 className="mb-4 text-xl font-semibold text-blue">Table Name</h2>
      <div className="mb-4 flex items-center justify-center">
        <Select
          placeholder="Select table Name"
          options={tableList}
          value={
            !tableName
              ? { label: 'Select table', value: '' }
              : { label: tableName, value: tableName }
          }
          onChange={handleTableChange}
          styles={customStyles}
          name={'table_name'}
          isLoading={(schemaName ? true : false) && !tableList}
        />
      </div>
      <h2 className="mb-4 text-xl font-semibold text-blue">Primary Key</h2>
      <div className="flex items-center justify-center">
        <Select
          placeholder="Select Column Name"
          options={columnList}
          value={
            !primaryKeyColumn
              ? { label: 'Select primary key column', value: '' }
              : { label: primaryKeyColumn, value: primaryKeyColumn }
          }
          onChange={handleColumnChange}
          styles={customStyles}
          name={'primary_key_column'}
          isLoading={!columnList && tableName !== ''}
        />
      </div>
    </div>
  );
};
