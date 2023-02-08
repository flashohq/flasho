import { head } from 'cypress/types/lodash';
import makeAnimated from 'react-select/animated';
export const animatedComponents = makeAnimated();

export const customStyles = {
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
  input: (provided: any, state: any) => ({
    ...provided,
    width: '20rem'
  }),
  container: (provided: any, state: any) => ({
    ...provided,
    width: '20rem'
  })
};

export const customStyles2 = {
  menuList: (base: any) => ({ ...base, maxHeight: 150 }),
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
    width: '15rem'
  }),
  container: (provided: any, state: any) => ({
    ...provided,
    width: '15rem'
  })
};
