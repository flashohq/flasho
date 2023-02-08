import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { RootState } from '../../../../redux/store';
import { TEMPLATE_EMAIL_DATA } from '../../../../redux/types/email_template';
import {
  customStyles,
  customStyles2,
  animatedComponents
} from '../../../../styles/styled-selectors';
import { Button } from '../../../library/button';

const templateInit: TEMPLATE_EMAIL_DATA = {
  id: -1,
  title: '',
  service_name: '',
  schema_name: '',
  table_name: '',
  email_column: '',
  table_type: '',
  language: '',
  subject: '',
  user_created: false,
  body_html: '',
  body_design: {},
  body_image: ''
};

const ModeEmail = (props: any) => {
  const { openForeignKeyModal, openModal } = props;

  const dispatch = useDispatch();
  const integrationList = useSelector(
    (state: RootState) => state.integrations.email
  );
  const { schema_name: userSchemaName, table_name: userTableName } =
    useSelector((state: RootState) => state.user_table);

  const templateData = useRef<TEMPLATE_EMAIL_DATA>(templateInit);
  const {
    schema_name: schemaName,
    table_name: tableName,
    email_template_id,
    sms_template_id,
    foreign_key_column: foreignKeyColumn
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const {
    service_name: messageService,
    table_type: tableType,
    email_column: emailColumn
  } = templateData.current;

  const columnsBySchemaAndTable = useSelector(
    (state: RootState) => state.columns
  );

  const { event } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const columnList: any = columnsBySchemaAndTable[`${schemaName}$${tableName}`];

  const userTable = useSelector((state: RootState) => state.user_table);

  const userColumnList: any =
    columnsBySchemaAndTable[`${userSchemaName}$${userTableName}`];

  if (email_template_id && email_template_id !== '') {
    const { [email_template_id]: emailTemplateData } = useSelector(
      (state: RootState) => state.email_templates.user
    );
    templateData.current = emailTemplateData;
  }

  useEffect(() => {
    if (!userColumnList && userSchemaName !== '' && userTableName !== '') {
      dispatch.columns.getColumns({
        schema_name: userSchemaName,
        table_name: userTableName
      });
    }
  }, []);

  const updateTemplateData = (key: string, value: string) => {
    dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
      email_template_id,
      key: key,
      value: value
    });
  };

  return (
    <>
      <section className="step_header">
        <h2> Which Email service do you intend to use ?</h2>
      </section>
      <div className="my-4 flex items-center justify-center">
        <Select
          options={integrationList}
          components={animatedComponents}
          menuPortalTarget={document.body}
          placeholder="Select Service"
          styles={customStyles}
          onChange={(e: any) => updateTemplateData('service_name', e.value)}
          isLoading={!integrationList}
          noOptionsMessage={() => `No email service integrated `}
        />
      </div>
      <div>
        <section className="step_header">
          <h2>Select the column for Email</h2>
        </section>
        <div>
          <div className="mt-4 flex items-center justify-center">
            <p className=" mr-2 text-lg text-black">
              Email Address column is present in
            </p>
            <Select
              options={[
                { value: 'user_table', label: 'User Table' },
                { value: 'trigger_table', label: 'Trigger Table' }
              ]}
              value={{}}
              components={animatedComponents}
              placeholder="Select table"
              styles={customStyles2}
              menuPortalTarget={document.body}
              onChange={(e: any) => {
                updateTemplateData('table_type', e.value);
                updateTemplateData('email_column', '');
              }}
            />
            {
              // Display when foreign Key is added
              tableType === 'user_table' && foreignKeyColumn !== '' && (
                <img
                  src={'/icons/key_icon.svg'}
                  className={'ml-2 h-6 w-6 cursor-pointer object-contain'}
                  onClick={openForeignKeyModal}
                />
              )
            }
          </div>
          {event === 'MANUAL'
            ? null
            : tableType === 'user_table' && (
                <>
                  {userTable ? (
                    <>
                      {Object.keys(userTable).length === 0 ? (
                        <div className="flex flex-col items-center">
                          <p className="mt-8 mb-4 flex items-center justify-center text-red">
                            <img
                              src={'/icons/warning-icon.svg'}
                              className={'mr-2 h-6 w-6 object-contain'}
                            />
                            User Table not found
                          </p>
                          <Button text={'Add User table'} onClick={openModal} />
                        </div>
                      ) : (
                        foreignKeyColumn === '' && (
                          <div className="mt-4 flex items-center justify-center">
                            <button
                              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-blue px-4 py-2 shadow-lg hover:shadow"
                              onClick={openForeignKeyModal}
                            >
                              <p className="text-lg font-medium text-blue">
                                Add Foreign Key{' '}
                              </p>
                              <img
                                src={'/icons/key_icon.svg'}
                                className={'ml-2 h-5 w-5  object-contain'}
                              />
                            </button>
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <div className="mt-4 flex items-center justify-center">
                      <img src="/icons/spinner_blue.svg" />
                    </div>
                  )}
                </>
              )}
          {(tableType === 'trigger_table' ||
            (tableType === 'user_table' && foreignKeyColumn !== '')) && (
            <>
              messageMode === 'Email' && (
              <div className="mt-6 flex items-center justify-center">
                {
                  <Select
                    options={
                      tableType === 'user_table' ? userColumnList : columnList
                    }
                    components={animatedComponents}
                    placeholder="Select Email Column"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    value={
                      emailColumn !== '' && {
                        label: emailColumn,
                        value: emailColumn
                      }
                    }
                    onChange={(e: any) =>
                      updateTemplateData('email_column', e.label)
                    }
                    isLoading={
                      tableType === 'user_table' ? !userColumnList : !columnList
                    }
                  />
                }
              </div>
              )
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModeEmail;
