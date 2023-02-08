import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { RootState } from '../../../../redux/store';
import {
  customStyles,
  customStyles2,
  animatedComponents
} from '../../../../styles/styled-selectors';
import { Button } from '../../../library/button';
import { SMSTemplate } from '../../../../redux/types/sms_template';
import { RadioGroup } from '@headlessui/react';

const templateInit: SMSTemplate = {
  title: '',
  service_name: '',
  schema_name: '',
  table_name: '',
  table_type: '',
  contains_country_code: false,
  country_code_column: '',
  phone_number_column: '',
  type: '',
  language: '',
  message_body: ''
};

const ModeSMS = (props: any) => {
  const { openForeignKeyModal, openModal } = props;

  const dispatch = useDispatch();
  const integrationList: any = useSelector(
    (state: RootState) => state.integrations.sms
  );
  const { schema_name: userSchemaName, table_name: userTableName } =
    useSelector((state: RootState) => state.user_table);

  const templateData: any = useRef<SMSTemplate>(templateInit);
  const {
    schema_name: schemaName,
    table_name: tableName,
    sms_template_id,
    foreign_key_column: foreignKeyColumn
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const { table_type: tableType } = templateData.current;

  const columnsBySchemaAndTable = useSelector(
    (state: RootState) => state.columns
  );

  const columnList: any = columnsBySchemaAndTable[`${schemaName}$${tableName}`];
  const { event } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );
  const userTable = useSelector((state: RootState) => state.user_table);

  const userColumnList: any =
    columnsBySchemaAndTable[`${userSchemaName}$${userTableName}`];

  useEffect(() => {
    if (sms_template_id && sms_template_id !== '') {
      const { [sms_template_id]: smsTemplateData } = useSelector(
        (state: RootState) => state.sms_templates
      );
      templateData.current = smsTemplateData;
    }
  }, [sms_template_id]);

  useEffect(() => {
    if (!userColumnList && userSchemaName !== '' && userTableName !== '') {
      dispatch.columns.getColumns({
        schema_name: userSchemaName,
        table_name: userTableName
      });
    }
  }, []);

  const updateTemplateData = (key: string, value: string) => {
    dispatch.sms_templates.UPDATE_SMS_TEMPLATE({
      sms_template_id,
      key: key,
      value: value
    });
  };

  return (
    <>
      <section className="step_header">
        <h2> Which SMS service do you intend to use ?</h2>
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
          <h2>Select the column for Phone Number</h2>
        </section>
        <div>
          <div className="mt-4 flex items-center justify-center">
            <p className=" mr-2 text-lg text-black">
              Phone number column is present in
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
                                Add Foreign Key
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
              <div className="my-4 flex items-center justify-center">
                <RadioGroup
                  onChange={(value: any) =>
                    updateTemplateData('has_country_code', value)
                  }
                  value={templateData.current.has_country_code}
                >
                  <div className="flex items-center justify-center">
                    <RadioGroup.Option value={'no'}>
                      {({ checked }) => (
                        <div className="mr-6 flex items-center">
                          <img
                            src={
                              checked
                                ? '/icons/radio_circle_active.svg'
                                : '/icons/radio_circle.svg'
                            }
                          />
                          <p
                            className={`text-lg font-medium ${
                              checked ? 'text-blue' : 'text-black'
                            }`}
                          >
                            Country code and Phone number
                          </p>
                        </div>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option value={'yes'}>
                      {({ checked }) => (
                        <div className="flex items-center">
                          <img
                            src={
                              checked
                                ? '/icons/radio_circle_active.svg'
                                : '/icons/radio_circle.svg'
                            }
                          />
                          <p
                            className={`text-lg font-medium ${
                              checked ? 'text-blue' : 'text-black'
                            }`}
                          >
                            Phone number (has country code)
                          </p>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-6 flex items-center justify-center">
                {templateData.current.has_country_code && (
                  <div className="flex items-center justify-evenly">
                    <Select
                      options={
                        tableType === 'user_table' ? userColumnList : columnList
                      }
                      components={animatedComponents}
                      placeholder="Column for Country code"
                      styles={customStyles}
                      menuPortalTarget={document.body}
                      onChange={e =>
                        updateTemplateData('country_code_column', e.label)
                      }
                      value={
                        templateData.current.country_code_column && {
                          label: templateData.current.country_code_column,
                          value: templateData.current.country_code_column
                        }
                      }
                      isLoading={
                        tableType === 'user_table'
                          ? !userColumnList
                          : !columnList
                      }
                    />
                    <div className="w-8" />
                    <Select
                      options={
                        tableType === 'user_table' ? userColumnList : columnList
                      }
                      components={animatedComponents}
                      placeholder="Column for Phone number"
                      styles={customStyles}
                      menuPortalTarget={document.body}
                      onChange={e =>
                        updateTemplateData('phone_number_column', e.label)
                      }
                      value={
                        templateData.current.phone_number_column && {
                          label: templateData.current.phone_number_column,
                          value: templateData.current.phone_number_column
                        }
                      }
                      isLoading={
                        tableType === 'user_table'
                          ? !userColumnList
                          : !columnList
                      }
                    />
                  </div>
                )}
                {templateData.current.has_country_code === 'yes' && (
                  <Select
                    options={
                      tableType === 'user_table' ? userColumnList : columnList
                    }
                    components={animatedComponents}
                    placeholder="Column for Phone number"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    onChange={e =>
                      updateTemplateData('phone_number_column', e.label)
                    }
                    value={
                      templateData.current.phone_number_column && {
                        label: templateData.current.phone_number_column,
                        value: templateData.current.phone_number_column
                      }
                    }
                    isLoading={
                      tableType === 'user_table' ? !userColumnList : !columnList
                    }
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModeSMS;
