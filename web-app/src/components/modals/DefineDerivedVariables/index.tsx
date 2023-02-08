import { useNotification } from '../../../Notifications/NotificationProvider';
import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { ModalButton } from '../../library/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { customStyles } from '../../../styles/styled-selectors';

const animatedComponents = makeAnimated();

const customStylesOper = {
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
    width: '10rem'
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 8,
    width: '10rem',
    height: '2.2rem'
  })
};

const SelectOption = (props: any) => {
  const {
    primaryVariables,
    derivedVariables,
    derivedVariablesForm,
    setDerivedVariableForm,
    idx,
    placeholder,
    name,
    retrieveDataType
  } = props;

  const genIntOptions = () => {
    let intOptions: Array<any> = [];

    Object.keys(primaryVariables).map((variableName: string) => {
      if (primaryVariables[variableName].data_type !== 'text') {
        {
          intOptions.push({ value: variableName, label: variableName });
        }
      }
    });

    Object.keys(derivedVariables).map((variableName: string) => {
      if (derivedVariables[variableName].data_type !== 'text') {
        {
          intOptions.push({ value: variableName, label: variableName });
        }
      }
    });
    return intOptions;
  };

  const genStringOptions = () => {
    let strOptions: Array<any> = [];

    Object.keys(primaryVariables).map((variableName: string) => {
      if (primaryVariables[variableName].data_type === 'text') {
        {
          strOptions.push({ value: variableName, label: variableName });
        }
      }
    });

    Object.keys(derivedVariables).map((variableName: string) => {
      if (derivedVariables[variableName].data_type === 'text') {
        {
          strOptions.push({ value: variableName, label: variableName });
        }
      }
    });
    return strOptions;
  };

  const [options, setOptions] = useState<Array<any>>([]);

  const genOptionsController = (index: number) => {
    let currentOptions = [];
    if (retrieveDataType(index) == 0 || name == 'variable1') {
      currentOptions = [...genIntOptions(), ...genStringOptions()];
    } else if (retrieveDataType(index) == -1) {
      currentOptions = genIntOptions();
    } else {
      currentOptions = genStringOptions();
    }
    setOptions(currentOptions);
  };

  const handleFormDropDown = (e: any, idx: number) => {
    let newFormValues = [...derivedVariablesForm];
    newFormValues[idx][name] = e.value;
    setDerivedVariableForm(newFormValues);
  };

  useEffect(() => {
    genOptionsController(idx);
  }, [derivedVariablesForm]);

  return (
    <Select
      components={animatedComponents}
      placeholder={placeholder}
      options={options}
      onChange={e => handleFormDropDown(e, idx)}
      styles={customStyles}
      name={name}
      menuPortalTarget={document.body}
    />
  );
};

const SelectOperation = (props: any) => {
  const {
    idx,
    derivedVariablesForm,
    setDerivedVariableForm,
    name,
    retrieveDataType
  } = props;
  const [options, setOptions] = useState<Array<any>>([]);

  const genStringOperations = () => {
    return [
      {
        value: '+',
        label: 'Concatenate'
      }
    ];
  };
  const genIntOperations = () => {
    return [
      {
        value: '+',
        label: 'Add'
      },
      {
        value: '-',
        label: 'Subtract'
      },
      {
        value: '*',
        label: 'Multiply'
      },
      {
        value: '/',
        label: 'Divide'
      }
    ];
  };

  const genOperationsList = (index: number) => {
    let currentOperations = [];
    if (retrieveDataType(index) == -1) {
      currentOperations = genIntOperations();
    } else if (retrieveDataType(index) == 0) {
      currentOperations = [...genIntOperations(), ...genStringOperations()];
    } else {
      currentOperations = genStringOperations();
    }
    setOptions(currentOperations);
  };

  const handleFormDropDown = (e: any, idx: number) => {
    let newFormValues = [...derivedVariablesForm];
    newFormValues[idx][name] = e.value;
    setDerivedVariableForm(newFormValues);
  };

  useEffect(() => {
    genOperationsList(idx);
  }, [derivedVariablesForm]);

  return (
    <Select
      components={animatedComponents}
      placeholder={'Operation'}
      options={options}
      onChange={e => handleFormDropDown(e, idx)}
      styles={customStylesOper}
      name={name}
      menuPortalTarget={document.body}
    />
  );
};

const DefineDerivedVariables = (props: any) => {
  const { closeModal, open } = props;

  const {
    configuration: {
      variables: { primary: primaryVariables, derived: derivedVariables }
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const [derivedVariablesForm, setDerivedVariableForm] = useState([
    { variable_name: '', variable1: '', variable2: '', operation: '' }
  ]);

  useEffect(() => {});

  const dispatch = useDispatch();

  const handleFormData = (e: any, idx: number) => {
    let form: any = [...derivedVariablesForm];
    form[idx][e.target.name] = e.target.value;
    setDerivedVariableForm(form);
  };

  const addFormField = () => {
    const newField = {
      variable_name: '',
      variable1: '',
      variable2: '',
      operation: ''
    };
    setDerivedVariableForm([...derivedVariablesForm, newField]);
  };

  useEffect(() => {
    formRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'end'
    });
  }, [derivedVariablesForm]);

  const deleteFormField = (idx: number) => {
    let formData = [...derivedVariablesForm];
    formData = formData.filter((content: any, index: number) => index !== idx);
    setDerivedVariableForm(formData);
  };

  const notification = useNotification();
  const notificationID = 'derivedVariableDanger';

  const validateFormFields = () => {
    let validationStatus = true;
    derivedVariablesForm.forEach((formFields: any) => {
      if (
        formFields.variable_name == '' ||
        formFields.variable1 == '' ||
        formFields.variable2 == '' ||
        formFields.operation == ''
      ) {
        validationStatus = false;
      }
    });
    return validationStatus;
  };

  const submitDerVarsForm = (event: any) => {
    event.preventDefault();
    const validationStatus = validateFormFields();
    if (!validationStatus) {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: `Incomplete Fields`,
          status: 'danger',
          description: 'Please fill or remove empty fields'
        });
      }
      return;
    }

    dispatch.trigger_drafts.addDerivedVariables({ derivedVariablesForm });
    closeModal();
  };

  const retrieveDataType = (index: number) => {
    if (derivedVariablesForm[index].variable1 == '') {
      return 0;
    } else if (derivedVariablesForm[index].variable1 in primaryVariables) {
      return primaryVariables[derivedVariablesForm[index].variable1]
        .data_type == 'text'
        ? 1
        : -1;
    } else {
      return derivedVariables[derivedVariablesForm[index].variable1]
        .data_type == 'text'
        ? 1
        : -1;
    }
  };

  const formRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Define Derived Variables</p>
          <img
            src="/icons/cross_black.svg"
            className="cursor-pointer"
            onClick={closeModal}
            data-cy="closeDDV"
          />
        </div>
        <div className="modal_content my-0 h-[50vh] overflow-y-auto">
          <div className="v_stack relative">
            {derivedVariablesForm.map((ele: any, idx: number) => (
              <div key={idx} className="relative mt-8 pl-12">
                <div className="h_stack absolute left-1 top-1 h-9 w-9 rounded-full bg-lightgray p-5 text-lg font-bold">
                  {idx + 1}
                </div>
                <div className="w-full rounded-lg bg-lightgray py-4 px-8">
                  <form>
                    <div className="mb-1.5 flex items-center justify-start">
                      <label
                        className="mr-2 w-fit py-2.5"
                        htmlFor="variable_name"
                      >
                        New Variable Name
                      </label>
                      <input
                        className="modal_input bg-white"
                        placeholder="Variable Name"
                        name="variable_name"
                        id="variable_name"
                        value={ele.variable_name}
                        autoComplete="off"
                        onChange={(e: any) => handleFormData(e, idx)}
                        required
                        autoFocus={idx === 0}
                        data-cy="varName2"
                      />
                    </div>
                    <div className="h_stack">
                      <p>Relation</p>
                      <div className="h_stack ml-2">
                        <div id="optiion1" className="m-1">
                          <SelectOption
                            derivedVariablesForm={derivedVariablesForm}
                            setDerivedVariableForm={setDerivedVariableForm}
                            derivedVariables={derivedVariables}
                            primaryVariables={primaryVariables}
                            retrieveDataType={retrieveDataType}
                            idx={idx}
                            placeholder={'Select Variable'}
                            name={'variable1'}
                          />
                        </div>
                        <div id="operation" className="m-1">
                          <SelectOperation
                            idx={idx}
                            derivedVariablesForm={derivedVariablesForm}
                            setDerivedVariableForm={setDerivedVariableForm}
                            retrieveDataType={retrieveDataType}
                            name={'operation'}
                          />
                        </div>
                        <div id="option2" className="m-1">
                          <SelectOption
                            derivedVariablesForm={derivedVariablesForm}
                            derivedVariables={derivedVariables}
                            primaryVariables={primaryVariables}
                            setDerivedVariableForm={setDerivedVariableForm}
                            retrieveDataType={retrieveDataType}
                            idx={idx}
                            placeholder={'Select Variable'}
                            name={'variable2'}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end p-3">
                      <img
                        src="/icons/trash_bin.svg"
                        alt="delete"
                        className="ml-4 h-5 cursor-pointer"
                        onClick={() => deleteFormField(idx)}
                        data-cy="deleteBtn2"
                      />
                    </div>
                  </form>
                </div>
              </div>
            ))}
            <div
              className="sticky right-4 bottom-4 mt-8 cursor-pointer rounded-full bg-red2 p-2.5"
              onClick={addFormField}
              data-cy="addBtn2"
            >
              <img
                src="/icons/add-white.svg"
                alt="add"
                className="cursor-pointer"
              />
            </div>
            <div ref={formRef} />
          </div>
        </div>
        <div className="modal_footer" data-cy="addDerivedVariables">
          <ModalButton onClick={submitDerVarsForm}>Confirm</ModalButton>
        </div>
      </div>
    </div>
  );
};

SelectOption.propTypes = {
  primaryVariables: PropTypes.object,
  derivedVariables: PropTypes.object,
  derivedVariablesForm: PropTypes.arrayOf(PropTypes.object),
  setDerivedVariableForm: PropTypes.func,
  idx: PropTypes.number,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  setDerivedVariables: PropTypes.func,
  retrieveDataType: PropTypes.func
};

SelectOperation.propTypes = {
  idx: PropTypes.number,
  derivedVariablesForm: PropTypes.arrayOf(PropTypes.object),
  setDerivedVariableForm: PropTypes.func,
  name: PropTypes.string,
  retrieveDataType: PropTypes.func
};

DefineDerivedVariables.propTypes = {
  closeModal: PropTypes.func,
  open: PropTypes.bool
};

export default DefineDerivedVariables;
