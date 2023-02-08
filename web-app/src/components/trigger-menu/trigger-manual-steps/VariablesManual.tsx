import { useNotification } from '../../../Notifications/NotificationProvider';
import { useEffect, useState } from 'react';
import { ButtonLG } from '../../library/button';
import Tags from '../../library/tags';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axiosInstance from '../../../utils/axiosInstance';

const VariablesManual = (props: any) => {
  const { isEdit } = props;
  const dispatch = useDispatch();

  const toast = useNotification();
  const toastId = 'manualTriggerNameError';
  const [variable, setVariable] = useState<string>('');

  const [titleError, setTitleError] = useState(false);
  const [checkingDoesTitleAlreadyExists, setCheckingDoesTitleAlreadyExists] =
    useState(false);

  const {
    name,
    configuration: {
      variables: { manual: manualVariables }
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  useEffect(() => {
    checkIfNameExists();
  }, [name]);

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

  const goToNext = () => {
    if (name.length == 0) {
      if (!toast.isActive(toastId) || checkingDoesTitleAlreadyExists) {
        toast({
          id: toastId,
          title: `Trigger name not assigned`,
          status: 'danger'
        });
      }
    } else {
      dispatch.trigger_drafts.updateValue({
        key: 'activeTab',
        value: 'Channel'
      });
    }
  };

  return (
    <>
      <div className="relative h-full w-full flex-grow bg-white">
        <div className="step_container">
          <section>
            <div>
              <section className="step_header">
                <h2>Create variables for the trigger</h2>
              </section>
              <section className="flex w-full items-center justify-center py-6">
                <form className="flex items-center">
                  <input
                    value={variable}
                    onChange={e => setVariable(e.target.value)}
                    className={
                      'mr-2 h-11 w-80 rounded-md border border-dullwhite bg-white p-2 outline-blue'
                    }
                  />
                  <button
                    onClick={event => {
                      event.preventDefault();
                      setVariable('');
                      dispatch.trigger_drafts.updateVariables({
                        type: 'manual',
                        variables: [...manualVariables, variable]
                      });
                    }}
                    disabled={variable === ''}
                    className={`flex h-11 items-center justify-center rounded-md p-3 font-bold text-honeydew ${
                      variable !== '' ? 'bg-red' : 'bg-gray2'
                    }`}
                  >
                    Add
                  </button>
                </form>
              </section>
            </div>
            {manualVariables?.length !== 0 && (
              <div className="mx-auto mt-4 mb-4 flex max-h-[250px]  w-11/12 justify-center rounded bg-empty3 p-3">
                {manualVariables?.map((variableName: string) => (
                  <Tags
                    text={variableName}
                    style={'bg-teal hover:bg-tealDark'}
                    onClick={() => {
                      dispatch.trigger_drafts.updateVariables({
                        type: 'manual',
                        variables: manualVariables.filter(
                          item => item != variableName
                        )
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
        <section className="absolute bottom-0 flex h-20 w-full items-center justify-center">
          <ButtonLG
            text={'Next'}
            onClick={goToNext}
            isDisabled={
              !isEdit &&
              (name.length === 0 ||
                titleError ||
                checkingDoesTitleAlreadyExists)
            }
            style={'px-20 w-56'}
          />
        </section>
      </div>
    </>
  );
};

export default VariablesManual;
