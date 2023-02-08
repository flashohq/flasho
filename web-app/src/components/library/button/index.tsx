import PropTypes from 'prop-types';

const Button = (props: any) => {
  return (
    <button
      onClick={props.onClick ? props.onClick : null}
      className={`button_defaults ${
        props.isDisabled && 'cursor-not-allowed bg-darkgray'
      } ${props.style && props.style} `}
    >
      <p className={`button_text ${props.textStyle && props.textStyle}`}>
        {props.text}
      </p>
    </button>
  );
};

const ButtonLG = (props: any) => {
  return (
    <button
      onClick={props.onClick ? props.onClick : null}
      className={`button_defaults_lg ${
        props.isDisabled && 'cursor-not-allowed bg-darkgray'
      } ${props.style && props.style}`}
    >
      <p className="button_text_lg">{props.text}</p>
    </button>
  );
};

const ButtonXL = (props: any) => {
  return (
    <button
      onClick={props.onClick ? props.onClick : null}
      className={`button_defaults_xl ${
        props.isDisabled && 'cursor-not-allowed bg-darkgray'
      }`}
    >
      <p className="button_text_xl">{props.text}</p>
    </button>
  );
};

const OptionButton = (props: any) => {
  return (
    <button
      onClick={props.onClick}
      className={`option_button_default ${
        props.isActive && 'bg-blue hover:bg-blue2'
      }  ${props.style && props.style}`}
    >
      <p
        className={`text-xl font-medium ${
          props.isActive ? 'text-honeydew' : 'text-black'
        } `}
      >
        {props.text}
      </p>
    </button>
  );
};

const IconButton = (props: any) => {
  return (
    <button
      onClick={props.onClick}
      className={`icon_button_default ${props.style && props.style}`}
    >
      <div className={`${props.iconContainer && props.iconContainer}`}>
        <img
          src={props.icon}
          className={`icon_button_icon_default ${
            props.iconStyle && props.iconStyle
          }`}
        />
      </div>
      <p className={`${props.textStyle && props.textStyle}`}>{props.text}</p>
    </button>
  );
};

const ModalButton = (props: any) => (
  <button
    className="modal_button"
    onClick={props.onClick ? props.onClick : null}
    disabled={props.isLoading ? props.isLoading : false}
  >
    {props.isLoading && <img src="/icons/loading.svg" alt="Loading" />}
    {!props.isLoading && props.children}
  </button>
);

const ModalRedButton = (props: any) => (
  <button
    className="modal_red_button"
    onClick={props.onClick ? props.onClick : null}
    disabled={props.isLoading ? props.isLoading : false}
  >
    {props.isLoading && <img src="/icons/loading.svg" alt="Loading" />}
    {!props.isLoading && props.children}
  </button>
);

const ModalGreenButton = (props: any) => (
  <button
    className="modal_green_button"
    onClick={props.onClick ? props.onClick : null}
    disabled={props.isLoading ? props.isLoading : false}
  >
    {props.isLoading && <img src="/icons/loading.svg" alt="Loading" />}
    {!props.isLoading && props.children}
  </button>
);

const ModalButtonDisabled = (props: any) => (
  <button className="modal_button_disabled">{props.children}</button>
);

Button.propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  style: PropTypes.string,
  textStyle: PropTypes.string,
  text: PropTypes.string
};
ButtonLG.propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  style: PropTypes.string,
  text: PropTypes.string
};
ButtonXL.propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  style: PropTypes.string,
  text: PropTypes.string
};
OptionButton.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  style: PropTypes.string,
  text: PropTypes.string
};
IconButton.propTypes = {
  onClick: PropTypes.func,
  iconContainer: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.string,
  style: PropTypes.string,
  textStyle: PropTypes.string,
  iconStyle: PropTypes.string
};

export {
  Button,
  ButtonLG,
  ButtonXL,
  OptionButton,
  IconButton,
  ModalButton,
  ModalRedButton,
  ModalGreenButton,
  ModalButtonDisabled
};
