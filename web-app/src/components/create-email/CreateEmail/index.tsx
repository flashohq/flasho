import { useNotification } from '../../../Notifications/NotificationProvider';
import Select from 'react-select';
import { useEffect, useState, useRef } from 'react';
import { ButtonLG, IconButton } from '../../library/button';
import makeAnimated from 'react-select/animated';
import CustomTextInput from '../../custom-text-input';
import InsertVariables from '../../modals/InsertVariables';
import axiosInstance from '../../../utils/axiosInstance';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { TEMPLATE_EMAIL_DATA } from '../../../redux/types/email_template';
import { customStyles } from '../../../styles/styled-selectors';

const languages = [
  { value: '0', label: 'English' },
  { value: '1', label: 'Mandarin' },
  { value: '2', label: 'Spanish' },
  { value: '3', label: 'Hindi' },
  { value: '4', label: 'Arabic' },
  { value: '5', label: 'Portuguese' },
  { value: '6', label: 'Russian' },
  { value: '7', label: 'Japanese' }
];

const animatedComponents = makeAnimated();

const CreateEmail = (props: any) => {
  const { setMessageTabState, isEdit } = props;

  const { email_template_id } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  let emailTemplate: any;

  if (email_template_id) {
    const { [email_template_id]: template } = useSelector(
      (state: RootState) => state.email_templates.user
    );
    emailTemplate = template;
  } else {
    emailTemplate = {};
  }

  console.log({ emailTemplate });
  console.log({ emailTemplate });

  const validateFormFields = () => {
    if (emailTemplate.subject === '') {
      return false;
    }
    return true;
  };

  const notification = useNotification();
  const notificationID = 'emailTemplateError';
  const [insertVariables, setInsertVariables] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [checkingDoesTitleAlreadyExists, setCheckingDoesTitleAlreadyExists] =
    useState(false);
  const textAreaRef: any = useRef();
  const dispatch = useDispatch();

  const closeInsertVarModal = () => {
    setInsertVariables(false);
  };

  useEffect(() => {
    checkIfNameExists();
  }, [emailTemplate.title]);

  const goToNext = () => {
    if (!validateFormFields()) {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: `Incomplete fields`,
          description: 'All fields are mandatory',
          status: 'danger'
        });
      }
    } else {
      setMessageTabState('draft');
    }
  };

  const updateTemplateData = (key: string, value: string) => {
    dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
      email_template_id,
      key: key,
      value: value
    });
  };

  const addVariableToTextField = (variableName: any) => {
    textAreaRef.current?.addTextToTextArea(`{{${variableName}}}`);
  };

  const checkIfNameExists = () => {
    console.log({ emailTemplate });
    if (emailTemplate.title === '') {
      return;
    }
    setCheckingDoesTitleAlreadyExists(true);
    const query_param = {
      trigger_name: emailTemplate.title
    };
    axiosInstance
      .get('/v1/triggers/', { params: query_param })
      .then(response => {
        const { data } = response;
        setCheckingDoesTitleAlreadyExists(false);
        console.log(data);
        data.length === 0 ? setTitleError(false) : setTitleError(true);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <InsertVariables
        open={insertVariables}
        closeModal={closeInsertVarModal}
        addVariableToTextField={addVariableToTextField}
      />
      <div className="relative h-full w-full flex-grow bg-white">
        <section className="step_header">
          <h2>Create a new Email</h2>
        </section>
        <div className="flex h-full w-full p-4">
          <div className="flex w-full flex-col items-center">
            {/* <div className="relative mb-3 flex items-center">
              <p
                className={
                  'mr-2 flex w-48 items-center justify-end text-lg text-black'
                }
              >
                Title
              </p>
              <input
                placeholder="Title for Email"
                className={
                  'w-80 rounded-md border border-dullwhite bg-white p-2 outline-blue'
                }
                name={'name'}
                onChange={(e: any) =>
                  updateTemplateData('title', e.target.value)
                }
                value={emailTemplate.title}
                required
                disabled={isEdit}
                data-cy="titleInput"
              />
              <div className="flex items-center">
                {emailTemplate.title !== '' && (
                  <>
                    {checkingDoesTitleAlreadyExists ? (
                      <div className="absolute -right-6 flex animate-spin items-center justify-center">
                        <img src={'/icons/loader.svg'} />
                      </div>
                    ) : (
                      <>
                        {titleError ? (
                          <div className="absolute -right-52 flex items-center ">
                            <img src={'/icons/failed.svg'} />
                            <p className={'ml-2'}>Please select valid title</p>
                          </div>
                        ) : (
                          <img
                            src={'/icons/check_circle.svg'}
                            className={' absolute -right-6'}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div> */}

            <div className="relative mb-3 flex items-center">
              <p
                className={
                  'mr-2 flex w-48 items-center justify-end text-lg text-black'
                }
              >
                Subject
              </p>
              <CustomTextInput
                ref={textAreaRef}
                type={'input'}
                placeholder="Subject for Email"
                className={
                  'w-80 rounded-md border border-dullwhite bg-white p-2 outline-blue'
                }
                name={'subject'}
                onChange={(text: string) => {
                  updateTemplateData('subject', text);
                }}
                value={emailTemplate.subject}
                required
                data-cy="subjectInput"
              />
              <IconButton
                icon={'/icons/plus.svg'}
                iconStyle={'h-5 w-5 object-contain'}
                text={'Insert Variables'}
                style={'border-red absolute -right-48 shadow-none'}
                textStyle={'font-bold text-red text-lg'}
                onClick={() => setInsertVariables(true)}
              />
            </div>
            <div className="flex items-center">
              <p
                className={
                  'mr-2 flex w-48 items-center justify-end text-lg text-black'
                }
              >
                Language
              </p>
              <Select
                components={animatedComponents}
                styles={customStyles}
                options={languages}
                onChange={(e: any) => updateTemplateData('language', e.value)}
                menuPortalTarget={document.body}
                defaultValue={{ label: 'English', value: '0' }}
              />
            </div>
          </div>
        </div>
        <section className="absolute bottom-0 flex h-20 w-full items-center justify-center">
          <ButtonLG
            text={'Next'}
            onClick={goToNext}
            isDisabled={!validateFormFields()}
            style={'px-20 w-56 z-50'}
          />
        </section>
      </div>
    </>
  );
};

CreateEmail.propTypes = {
  isEdit: PropTypes.bool,
  setMessageTabState: PropTypes.func
};

export default CreateEmail;
