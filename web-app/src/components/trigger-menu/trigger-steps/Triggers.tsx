import { useNotification } from '../../../Notifications/NotificationProvider';
import { ButtonLG, OptionButton } from '../../library/button';
import PropTypes from 'prop-types';
import { NextRouter, useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

const Triggers = () => {
  const router: NextRouter = useRouter();

  const triggerId: any = router.query.trigger_id;
  const [titleError, setTitleError] = useState(false);

  const [checkingDoesTitleAlreadyExists, setCheckingDoesTitleAlreadyExists] =
    useState(false);

  const trigger = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const { name } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const { event } = trigger;

  console.log({ trigger });

  const dispatch = useDispatch();

  const toast = useNotification();
  const toastId = 'triggerError';
  const toastTriggerName = 'triggerError';
  const goToNext = () => {
    if (event === '') {
      if (!toast.isActive(toastId) || checkingDoesTitleAlreadyExists) {
        toast({
          id: toastId,
          title: `Incomplete Fields`,
          status: 'danger',
          description: 'Please select trigger event '
        });
      }
    } else if (name === '' || titleError) {
      if (!toast.isActive(toastTriggerName)) {
        toast({
          id: toastId,
          title: `Incomplete Fields`,
          status: 'danger',
          description: 'Please enter valid trigger name'
        });
      }
    } else {
      dispatch.trigger_drafts.updateValue({
        key: 'activeTab',
        value: 'Variables'
      });
    }
  };

  const handleTriggerName = (event: any) => {
    dispatch.trigger_drafts.updateValue({
      key: 'name',
      value: event.target.value
    });
  };

  const checkIfNameExists = () => {
    console.log('hello in checkIfNameExists');
    if (name === '') {
      return;
    }

    setCheckingDoesTitleAlreadyExists(true);
    const query_param = {
      trigger_name: name
    };

    axiosInstance
      .get('/v1/triggers/', { params: query_param })
      .then((response: any) => {
        const { data } = response;
        console.log({ data });
        setCheckingDoesTitleAlreadyExists(false);
        data.length === 0 ? setTitleError(false) : setTitleError(true);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    checkIfNameExists();
  }, [name]);

  return (
    <div className="h-full w-full flex-grow bg-white">
      <div className="step_container pb-20">
        <div className="mb-1">
          <section className="step_header">
            <h2>Enter title for the trigger</h2>
          </section>
          <div className="flex flex-col items-center py-2 ">
            {/* <p className="mb-4 select-none text-lg font-medium text-black">
              Trigger Name
            </p> */}
            <div className="relative my-4 flex items-center justify-center">
              <input
                onChange={handleTriggerName}
                value={name}
                className={
                  'w-80 rounded-md border border-dullwhite bg-white p-2 outline-blue'
                }
              />
              <div className="flex items-center">
                {name !== '' && (
                  <>
                    {checkingDoesTitleAlreadyExists ? (
                      <div className="absolute -right-8 flex animate-spin items-center justify-center">
                        <img src={'/icons/loader.svg'} />
                      </div>
                    ) : (
                      <>
                        {titleError ? (
                          <div className="absolute -right-52 flex items-center ">
                            <img src={'/icons/failed.svg'} />
                            <p className={'ml-2'}>Please enter valid title.</p>
                          </div>
                        ) : (
                          <img
                            src={'/icons/check_circle.svg'}
                            className={' absolute -right-8'}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <section className="step_header">
          <h2>When should the message be triggered ?</h2>
        </section>
        <section className="flex flex-col items-center">
          <div className="mt-6 grid grid-flow-col grid-rows-2 items-center">
            <OptionButton
              text={'A row is inserted in the DB'}
              isActive={event === 'INSERT'}
              onClick={() =>
                dispatch.trigger_drafts.updateValue({
                  id: triggerId,
                  key: 'event',
                  value: 'INSERT'
                })
              }
              style={'m-4'}
            />
            <OptionButton
              text={'A row is updated in the DB'}
              isActive={event === 'UPDATE'}
              onClick={() =>
                dispatch.trigger_drafts.updateValue({
                  id: triggerId,
                  key: 'event',
                  value: 'UPDATE'
                })
              }
              style={'m-4'}
            />
            <OptionButton
              text={'A row is deleted in the DB'}
              isActive={event === 'DELETE'}
              onClick={() =>
                dispatch.trigger_drafts.updateValue({
                  id: triggerId,
                  key: 'event',
                  value: 'DELETE'
                })
              }
              style={'m-4'}
            />
            <OptionButton
              text={'Triggered manually by you'}
              isActive={event === 'MANUAL'}
              onClick={() =>
                dispatch.trigger_drafts.updateValue({
                  id: triggerId,
                  key: 'event',
                  value: 'MANUAL'
                })
              }
              style={'m-4'}
            />
          </div>
        </section>
      </div>
      <section className="absolute bottom-0 flex h-16 w-4/5 items-center justify-center bg-white">
        <ButtonLG text={'Next'} onClick={goToNext} style={'px-20 w-56'} />
      </section>
    </div>
  );
};

Triggers.propTypes = {
  setActive: PropTypes.func,
  typeOfTrigger: PropTypes.number,
  setTypeOfTrigger: PropTypes.func,
  updateLocalStorage: PropTypes.func
};

export default Triggers;
