import { useNotification } from '../../../Notifications/NotificationProvider';
import { RadioGroup } from '@headlessui/react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import AddUserTable from '../../modals/AddUserTable';
import AddForeignKey from '../../modals/AddForeignKey';
import { ButtonLG, Button } from '../../library/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  customStyles,
  customStyles2,
  animatedComponents
} from '../../../styles/styled-selectors';

const Channel = (props: any) => {
  const notification = useNotification();
  const notificationID = 'channelError';
  const dispatch = useDispatch();

  const { emailTemplates, smsTemplates, mode } = props;
  const {
    id,
    schema_name: schemaName,
    table_name: tableName,
    email_template_id,
    sms_template_id,
    foreign_key_column: foreignKeyColumn,
    event,
    configuration: {
      variables: { manual }
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const integrationList: any = useSelector(
    (state: RootState) => state.integrations
  );

  const { schema_name: userSchemaName, table_name: userTableName } =
    useSelector((state: RootState) => state.user_table);
  const columnsBySchemaAndTable = useSelector(
    (state: RootState) => state.columns
  );

  const columnList: any = columnsBySchemaAndTable[`${schemaName}$${tableName}`];

  const userColumnList: any =
    columnsBySchemaAndTable[`${userSchemaName}$${userTableName}`];

  const userTable = useSelector((state: RootState) => state.user_table);

  let messageModeValue = '';
  let templateData: any;

  if (email_template_id && email_template_id !== '') {
    console.log({ email_id: email_template_id });
    const emailTemplateData = emailTemplates[email_template_id];
    templateData = emailTemplateData;
    messageModeValue = 'Email';
  } else if (sms_template_id && sms_template_id !== '') {
    const smsTemplateData = smsTemplates[sms_template_id];
    templateData = smsTemplateData;
    messageModeValue = 'SMS';
  } else {
    templateData = {};
    messageModeValue = '';
  }

  console.log({ email_template_id, sms_template_id, templateData });

  const {
    service_name: messageService,
    table_type: tableType,
    email_column: emailColumn
  } = templateData;

  const [messageMode, setMessageMode] = useState(messageModeValue);

  useEffect(() => {
    if (!integrationList) {
      dispatch.integrations.LOAD_CONFIG();
    }
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

  const [userTableModal, setUserTableModal] = useState<boolean>(false);
  const [foreignKeyModal, setForeignKeyModal] = useState<boolean>(false);

  const openModal = () => {
    setUserTableModal(true);
  };
  const closeModal = () => {
    setUserTableModal(false);
  };

  const openForeignKeyModal = () => {
    setForeignKeyModal(true);
  };

  const closeForeignKeyModal = () => {
    setForeignKeyModal(false);
  };

  const validateFormFields = () => {
    if (messageService === '') {
      return false;
    }
    if (messageMode === 'SMS') {
      if (templateData.has_country_code) {
        if (
          templateData.country_code_column === '' ||
          templateData.phone_number_column === ''
        ) {
          return false;
        }
        return true;
      } else {
        return templateData.phone_number_column !== '';
      }
    } else {
      return emailColumn !== '';
    }
  };

  const goToNext = () => {
    if (!validateFormFields()) {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: `Incomplete Fields`,
          status: 'danger',
          description: 'All fields are mandatory'
        });
      }
    } else {
      dispatch.trigger_drafts.updateValue({
        key: 'activeTab',
        value: 'Message'
      });
    }
  };

  const updateTemplateData = (
    key: string,
    value: string | number | boolean
  ) => {
    if (messageMode === 'Email') {
      dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
        email_template_id,
        key: key,
        value: value
      });
    } else if (messageMode === 'SMS') {
      dispatch.sms_templates.UPDATE_SMS_TEMPLATE({
        sms_template_id,
        key: key,
        value: value
      });
    }
  };

  const getOptions = () => {
    return event === 'MANUAL'
      ? manual.map(variableName => {
          return {
            label: variableName,
            value: variableName
          };
        })
      : tableType === 'user_table'
      ? userColumnList
      : columnList;
  };

  return (
    <>
      {userTableModal && (
        <AddUserTable open={userTableModal} closeModal={closeModal} />
      )}
      {foreignKeyModal && (
        <AddForeignKey
          open={foreignKeyModal}
          closeModal={closeForeignKeyModal}
        />
      )}
      <div className="relative h-full w-full flex-grow bg-white">
        <div className="step_container">
          <div className={`${mode === 'Trigger' ? 'block' : 'hidden'}`}>
            <section className="step_header">
              <h2>How do you want to send this message ?</h2>
            </section>
            <div className="my-4 flex items-center justify-center">
              <button
                className={`mr-4 flex h-12 w-40 items-center justify-center rounded-md border border-dullwhite text-lg font-semibold ${
                  messageMode === 'Email' && 'bg-blue text-honeydew'
                } `}
                onClick={() => {
                  setMessageMode('Email');
                  updateTemplateData('service_name', '');
                  dispatch.trigger_drafts.addMessageMode({
                    messageMode: 'Email',
                    id: id
                  });
                }}
              >
                Email
              </button>
              <button
                className={`flex h-12 w-40 items-center  justify-center rounded-md border border-dullwhite text-lg font-semibold ${
                  messageMode === 'SMS' && 'bg-blue text-honeydew'
                } `}
                onClick={() => {
                  setMessageMode('SMS');
                  updateTemplateData('service_name', '');
                  dispatch.trigger_drafts.addMessageMode({
                    messageMode: 'SMS',
                    id: id
                  });
                }}
              >
                SMS
              </button>
            </div>
          </div>
          {(email_template_id !== '' || sms_template_id !== '') && (
            <div>
              <section className="step_header">
                <h2> Which {messageMode} service do you intend to use ?</h2>
              </section>
              <div className="my-4 flex items-center justify-center">
                <Select
                  options={
                    messageMode === 'Email'
                      ? integrationList.email.filter(
                          (item: any) => item.is_connected && item.is_active
                        )
                      : integrationList.sms.filter(
                          (item: any) => item.is_connected && item.is_active
                        )
                  }
                  components={animatedComponents}
                  menuPortalTarget={document.body}
                  placeholder="Select Service"
                  styles={customStyles2}
                  onChange={(e: any) =>
                    updateTemplateData('service_name', e.value)
                  }
                  isLoading={!integrationList}
                  value={
                    messageService.length !== 0
                      ? {
                          label: integrationList[
                            messageMode.toLowerCase()
                          ].find((item: any) => item.value === messageService)[
                            'label'
                          ],
                          value: messageService
                        }
                      : null
                  }
                  noOptionsMessage={() =>
                    `No ${messageMode} service integrated or active `
                  }
                />
              </div>
            </div>
          )}
          {(email_template_id !== '' || sms_template_id !== '') && (
            <div>
              <section className="step_header">
                <h2>
                  Select the column for{' '}
                  {messageMode === 'Email' ? 'Email Address' : 'Phone number'}
                </h2>
              </section>
              <div>
                {event !== 'MANUAL' && (
                  <div className="mt-4 flex items-center justify-center">
                    <p className=" mr-2 text-lg text-black">
                      {messageMode === 'Email'
                        ? "Email Address's "
                        : "Phone Number's "}
                      column is present in{' '}
                    </p>
                    <Select
                      options={[
                        {
                          value: 'user_table',
                          label: `User Table(${userTableName})`
                        },
                        {
                          value: 'trigger_table',
                          label: `Trigger Table(${tableName})`
                        }
                      ]}
                      value={
                        tableType === ''
                          ? null
                          : {
                              value: tableType,
                              label:
                                tableType === 'user_table'
                                  ? `User Table(${userTableName})`
                                  : `Trigger Table(${tableName})`
                            }
                      }
                      components={animatedComponents}
                      placeholder="Select table"
                      styles={customStyles2}
                      menuPortalTarget={document.body}
                      onChange={(e: any) => {
                        updateTemplateData('table_type', e.value);
                        updateTemplateData('email_column', '');
                        updateTemplateData('contains_country_code', true);
                        updateTemplateData('country_code_column', '');
                        updateTemplateData('phone_number_column', '');
                      }}
                    />
                    {
                      // Display when foreign Key is added
                      tableType === 'user_table' && foreignKeyColumn !== '' && (
                        <img
                          src={'/icons/key_icon.svg'}
                          className={
                            'ml-2 h-6 w-6 cursor-pointer object-contain'
                          }
                          onClick={openForeignKeyModal}
                        />
                      )
                    }
                  </div>
                )}
                {event !== 'MANUAL' && tableType === 'user_table' && (
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
                            <Button
                              text={'Add User table'}
                              onClick={openModal}
                            />
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
                {(event === 'MANUAL' ||
                  tableType === 'trigger_table' ||
                  (tableType === 'user_table' && foreignKeyColumn !== '')) && (
                  <>
                    {messageMode === 'SMS' && (
                      <div className="my-4 flex items-center justify-center">
                        <RadioGroup
                          onChange={value => {
                            updateTemplateData('contains_country_code', value);
                            updateTemplateData('country_code_column', '');
                            updateTemplateData('phone_number_column', '');
                          }}
                          value={templateData.contains_country_code}
                        >
                          <div className="flex items-center justify-center">
                            <RadioGroup.Option value={true}>
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
                            <RadioGroup.Option value={false}>
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
                    )}
                    {messageMode === 'Email' && (
                      <div className="mt-6 flex items-center justify-center">
                        {
                          <Select
                            options={getOptions()}
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
                              event === 'MANUAL'
                                ? false
                                : tableType === 'user_table'
                                ? !userColumnList
                                : !columnList
                            }
                          />
                        }
                      </div>
                    )}
                    {messageMode === 'SMS' && (
                      <div className="mt-6 flex items-center justify-center">
                        {templateData.contains_country_code && (
                          <div className="flex items-center justify-evenly">
                            <Select
                              options={getOptions()}
                              components={animatedComponents}
                              placeholder="Column for Country code"
                              styles={customStyles}
                              menuPortalTarget={document.body}
                              onChange={e =>
                                updateTemplateData(
                                  'country_code_column',
                                  e.label
                                )
                              }
                              value={
                                templateData.country_code_column && {
                                  label: templateData.country_code_column,
                                  value: templateData.country_code_column
                                }
                              }
                              isLoading={
                                event === 'MANUAL'
                                  ? false
                                  : tableType === 'user_table'
                                  ? !userColumnList
                                  : !columnList
                              }
                            />
                            <div className="w-8" />
                            <Select
                              options={getOptions()}
                              components={animatedComponents}
                              placeholder="Column for Phone number"
                              styles={customStyles}
                              menuPortalTarget={document.body}
                              onChange={e =>
                                updateTemplateData(
                                  'phone_number_column',
                                  e.label
                                )
                              }
                              value={
                                templateData.phone_number_column && {
                                  label: templateData.phone_number_column,
                                  value: templateData.phone_number_column
                                }
                              }
                              isLoading={
                                event === 'MANUAL'
                                  ? false
                                  : tableType === 'user_table'
                                  ? !userColumnList
                                  : !columnList
                              }
                            />
                          </div>
                        )}
                        {!templateData.contains_country_code && (
                          <Select
                            options={getOptions()}
                            components={animatedComponents}
                            placeholder="Column for Phone number"
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            onChange={e =>
                              updateTemplateData('phone_number_column', e.label)
                            }
                            value={
                              templateData.phone_number_column && {
                                label: templateData.phone_number_column,
                                value: templateData.phone_number_column
                              }
                            }
                            isLoading={
                              event === 'MANUAL'
                                ? false
                                : tableType === 'user_table'
                                ? !userColumnList
                                : !columnList
                            }
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <section className="absolute bottom-0 flex h-20 w-full items-center justify-center">
          <ButtonLG
            text={'Next'}
            onClick={goToNext}
            isDisabled={!validateFormFields()}
            style={'px-20 w-56'}
          />
        </section>
      </div>
    </>
  );
};

export default Channel;
