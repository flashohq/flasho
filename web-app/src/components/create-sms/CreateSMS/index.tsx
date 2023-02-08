import { useNotification } from '../../../Notifications/NotificationProvider';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from 'react';
import { ButtonLG } from '../../library/button';
import PropTypes from 'prop-types';
import axiosInstance from '../../../utils/axiosInstance';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { SMSTemplate } from '../../../redux/types/sms_template';
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

const CreateSMS = (props: any) => {
  const { setMessageTabState } = props;

  const dispatch = useDispatch();
  const { sms_template_id, isEdit } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  let smsTemplate: any;

  if (sms_template_id) {
    const { [sms_template_id]: template } = useSelector(
      (state: RootState) => state.sms_templates
    );
    smsTemplate = template;
  } else {
    smsTemplate = {};
  }

  const updateTemplateData = (key: string, value: string) => {
    dispatch.sms_templates.UPDATE_SMS_TEMPLATE({
      sms_template_id,
      key: key,
      value: value
    });
  };

  const notification = useNotification();
  const notificationID = 'smsTemplateError';

  const validateFormFields = () => {
    // if (smsTemplate.title === '') {
    //   return false;
    // }
    return true;
  };

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

  const [titleError, setTitleError] = useState(false);
  const [checkingDoesTitleAlreadyExists, setCheckingDoesTitleAlreadyExists] =
    useState(false);

  useEffect(() => {
    checkIfNameExists();
  }, [smsTemplate.title]);

  const checkIfNameExists = () => {
    if (smsTemplate.title === '') {
      return;
    }
    console.log(smsTemplate.title);
    setCheckingDoesTitleAlreadyExists(true);
    const query_param = {
      trigger_name: smsTemplate.title
    };
    axiosInstance
      .get('/v1/triggers/', { params: query_param })
      .then((response: any) => {
        const { data } = response;
        setCheckingDoesTitleAlreadyExists(false);
        console.log(data);
        data.length === 0 ? setTitleError(false) : setTitleError(true);
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <div className="relative h-full w-full flex-grow bg-white">
      <section className="step_header">
        <h2>Create a new SMS</h2>
      </section>
      <div className="h-full flex-grow py-8">
        <div className="flex flex-col items-center">
          {/* <div className="relative mb-4 flex items-center">
            <p className="mr-2 flex w-48 items-center justify-end">Title</p>
            <input
              className=" w-80 rounded border border-dullwhite bg-white p-2 outline-1 outline-blue"
              placeholder="Title for Message"
              value={smsTemplate.title}
              name={'name'}
              required={true}
              onChange={e => updateTemplateData('title', e.target.value)}
              disabled={isEdit}
              data-cy="inputTitle"
            />
            <div className="flex items-center">
              {smsTemplate.title !== '' && (
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
                          <p className={'ml-2'}>Please select valid column.</p>
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
          <div className="flex items-center">
            <p className="mr-2 flex w-48 items-center justify-end">Language</p>
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
  );
};

CreateSMS.propTypes = {
  setMessageTabState: PropTypes.func,
  isEdit: PropTypes.bool
};

export default CreateSMS;
