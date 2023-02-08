import { useNotification } from '../../../Notifications/NotificationProvider';
import styles from './Conditions.module.scss';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect, useRef, useState } from 'react';
import { ButtonLG, IconButton } from '../../library/button';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Condition } from '../../../redux/types/triggers';

interface ConditionsElement {
  variable_name: string;
  comparator: string;
  condition_value: string;
  logical_operator: string;
}

const FormBody = (props: any) => {
  const {
    idx,
    content,
    conditionsForm,
    setConditionsForm,
    primaryVariables,
    derivedVariables
  } = props;
  const animatedComponents = makeAnimated();
  const customStyles = {
    menuList: (base: any) => ({ ...base, maxHeight: 150, overflowY: 'scroll' }),
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
      width: '15rem',
      marginRight: '1rem'
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      width: '15rem'
    })
  };
  const customStylesOper = {
    menuList: (base: any) => ({ ...base, maxHeight: 150, overflowY: 'scroll' }),
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
    input: (provided: any, state: any) => ({
      ...provided,
      width: '14rem'
    }),
    container: (provided: any, state: any) => ({
      ...provided,
      width: '14rem'
    })
  };

  const comparator = [
    { value: '==', label: 'Equals' },
    { value: '!=', label: 'Not Equal' },
    { value: '>=', label: 'Greater than or Equal' },
    { value: '<=', label: 'Less than or Equal' },
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' }
  ];

  const variableList = [
    ...Object.keys(primaryVariables),
    ...Object.keys(derivedVariables)
  ].map(variableName => {
    return {
      value: variableName,
      label: variableName
    };
  });

  const handleFormVariable = (e: any, id: number, idx: number) => {
    console.log(e.value);
    let form = [...conditionsForm];
    form[idx][id]['variable_name'] = e.value;
    setConditionsForm(form);
  };

  const handleFormInput = (e: any, id: number, idx: number) => {
    console.log(e.target.value);
    let form = [...conditionsForm];
    form[idx][id][e.target.name] = e.target.value;
    setConditionsForm(form);
  };

  const handleFormComparator = (e: any, id: number, idx: number) => {
    console.log(e.value);
    let form = [...conditionsForm];
    form[idx][id]['comparator'] = e.value;
    setConditionsForm(form);
  };

  const add_AND = () => {
    let form = [...conditionsForm];
    let newField = {
      variable_name: '',
      comparator: '',
      condition_value: '',
      logical_operator: ''
    };
    form[idx][form[idx].length - 1].logical_operator = 'and';
    form[idx] = [...form[idx], newField];
    setConditionsForm(form);
  };

  const add_OR = () => {
    let form = [...conditionsForm];
    let newField = {
      variable_name: '',
      comparator: '',
      condition_value: '',
      logical_operator: ''
    };
    form[idx][form[idx].length - 1].logical_operator = 'or';
    form[idx] = [...form[idx], newField];
    setConditionsForm(form);
  };

  const deleteCondition = (idx: number) => {
    let form = [...conditionsForm];
    form.splice(idx, 1);
    setConditionsForm(form);
  };

  const deleteSubCondition = (idx1: number, idx2: number) => {
    let form = [...conditionsForm];

    form[idx1].splice(idx2, 1);

    if (form[idx1].length == 0) {
      form.splice(idx1, 1);
    } else if (form[idx1].length == idx2) {
      form[idx1][idx2 - 1].logical_operator = '';
    }

    setConditionsForm(form);
  };

  return (
    <div
      className="relative mb-4 mt-4 w-5/6 rounded-md bg-dullwhite peer-first:mt-0"
      key={idx}
    >
      <div className="absolute right-2 top-2 rounded p-1 hover:bg-dullwhite">
        <img
          src={'/icons/cross_black.svg'}
          className={' h-6 w-6 cursor-pointer object-contain'}
          onClick={() => deleteCondition(idx)}
        />
      </div>
      {content.map((form: ConditionsElement, id: number) => (
        <>
          <div className="mt-6 p-3" key={`${id}${idx}`}>
            <div className="flex items-center justify-center">
              <Select
                components={animatedComponents}
                placeholder="Variable Name"
                styles={customStyles}
                menuPortalTarget={document.body}
                name={'variable_name'}
                options={variableList}
                onChange={e => handleFormVariable(e, id, idx)}
                value={
                  form.variable_name == ''
                    ? { label: 'Variable Name', value: '' }
                    : {
                        label: form.variable_name,
                        value: form.variable_name
                      }
                }
              />
              <Select
                components={animatedComponents}
                options={comparator}
                placeholder="Comparator"
                styles={customStylesOper}
                name={'comparator'}
                onChange={e => handleFormComparator(e, id, idx)}
                value={
                  form.comparator == ''
                    ? { label: 'Comparator', value: '' }
                    : {
                        label: form.comparator,
                        value: form.comparator
                      }
                }
              />
              <input
                placeholder="Value"
                name={'condition_value'}
                value={form.condition_value}
                className={'ml-4 mr-2 h-9 max-w-sm rounded py-1 px-2'}
                onChange={(e: any) => handleFormInput(e, id, idx)}
                autoComplete={'off'}
              />
              <img
                src={'/icons/trash_bin.svg'}
                className={'h-5 w-5 cursor-pointer object-contain'}
                onClick={(e: any) => deleteSubCondition(idx, id)}
                data-cy="deleteIcon"
              />
            </div>

            {content.length - 1 === id && (
              <div className="mt-4 flex items-center justify-center">
                <div
                  className={
                    'mr-4 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-red font-semibold text-red hover:bg-red hover:text-honeydew'
                  }
                  onClick={add_AND}
                >
                  AND
                </div>
                <div
                  className={
                    'flex h-10 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-red font-semibold text-red hover:bg-red hover:text-honeydew'
                  }
                  onClick={add_OR}
                >
                  OR
                </div>
              </div>
            )}
          </div>
          {form.logical_operator.length !== 0 && (
            <div className="mt-4 flex items-center justify-center">
              {form.logical_operator === 'and' && (
                <div className="text-xl font-semibold text-red">AND</div>
              )}
              {form.logical_operator === 'or' && (
                <div className="text-xl font-semibold text-red">OR</div>
              )}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

const Conditions = () => {
  const {
    configuration: {
      variables: { derived: derivedVariables, primary: primaryVariables },
      conditions
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const userTable = useSelector((state: RootState) => state.user_table);
  console.log({ userTable });

  const [conditionsForm, setConditionsForm] =
    useState<Array<Array<Condition>>>(conditions);

  const dispatch = useDispatch();
  const toast = useNotification();
  const toastId = 'conditionsErrorToast';

  const goToNext = () => {
    if (!validateFormFields()) {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: `Incomplete Fields`,
          status: 'danger',
          description: 'Please fill or remove empty fields'
        });
      }
    } else {
      dispatch.trigger_drafts.updateValue({
        key: 'activeTab',
        value: 'Channel'
      });
    }
  };

  const defineNewCondition = () => {
    let newField = [
      {
        variable_name: '',
        comparator: '',
        condition_value: '',
        logical_operator: ''
      }
    ];
    let form = [...conditionsForm, newField];
    setConditionsForm(form);
    formRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'end'
    });
  };

  const checkFirstField = () => {
    if (conditionsForm.length === 1 && conditionsForm[0].length === 1) {
      const isField1 =
        conditionsForm[0][0].variable_name === '' &&
        (conditionsForm[0][0].comparator !== '' ||
          conditionsForm[0][0].condition_value !== '');
      const isField2 =
        conditionsForm[0][0].comparator === '' &&
        (conditionsForm[0][0].variable_name !== '' ||
          conditionsForm[0][0].condition_value !== '');
      const isFiled3 =
        conditionsForm[0][0].condition_value === '' &&
        (conditionsForm[0][0].variable_name !== '' ||
          conditionsForm[0][0].comparator !== '');
      console.log(isField1, ' ', isField2, ' ', isFiled3);
      return isField1 || isField2 || isFiled3;
    } else {
      return false;
    }
  };

  useEffect(() => {
    dispatch.trigger_drafts.updateConditions({ conditions: conditionsForm });
  }, [conditionsForm]);

  const validateFormFields = () => {
    let validationStatus = true;
    conditionsForm.forEach((subForm: any) => {
      subForm.forEach((formFields: any) => {
        if (
          formFields.variable_name === '' ||
          formFields.comparator === '' ||
          formFields.condition_value === ''
        ) {
          validationStatus = false;
        }
      });
    });
    const firstFieldCheck = checkFirstField();
    if (firstFieldCheck) {
      return false;
    } else if (
      conditionsForm.length === 1 &&
      conditionsForm[0].length === 1 &&
      !validationStatus
    ) {
      setConditionsForm([]);
      return true;
    }

    return validationStatus;
  };

  const formRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full flex-grow bg-white">
      <div className="step_container overflow-hidden">
        <section className="step_header">
          <h2>What are the conditions to send your message ?</h2>
        </section>
        <section className="flex h-16 w-full">
          <p className="my-4 mx-auto text-xl font-semibold">IF</p>
        </section>
        <section className={styles.conditions_conditions_container}>
          <section className="flex max-h-full flex-col items-center overflow-y-auto pb-32">
            {conditionsForm.map(
              (content: Array<ConditionsElement>, index: number) => (
                <>
                  <FormBody
                    idx={index}
                    content={content}
                    conditionsForm={conditionsForm}
                    setConditionsForm={setConditionsForm}
                    primaryVariables={primaryVariables}
                    derivedVariables={derivedVariables}
                  />
                  {conditionsForm.length - 1 !== index && (
                    <p className=" text-xl font-semibold text-black">OR</p>
                  )}
                </>
              )
            )}
            <div ref={formRef} />
          </section>
        </section>
      </div>
      <section className="absolute bottom-0 flex h-16 w-[75%] items-center justify-center bg-white">
        <ButtonLG text={'Next'} onClick={goToNext} style={'px-20 w-56 z-50'} />
        <div className="absolute right-1 flex h-full items-center">
          <IconButton
            icon={'/icons/plus_red.svg'}
            text={'Define new condition'}
            style={'border-[rgb(255,0,0)] mr-4'}
            textStyle={'text-[rgb(255,0,0)]'}
            onClick={defineNewCondition}
          />
        </div>
      </section>
    </div>
  );
};

FormBody.propTypes = {
  idx: PropTypes.number,
  content: PropTypes.arrayOf(PropTypes.object),
  conditionsForm: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  setConditionsForm: PropTypes.func,
  primaryVariables: PropTypes.object,
  derivedVariables: PropTypes.object
};

export default Conditions;
