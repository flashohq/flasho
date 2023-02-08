import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const CustomTextInput = forwardRef((props: any, ref: any) => {
  const [caretPosition, setCaretPosition] = useState(0);
  const { type } = props;

  useImperativeHandle(ref, () => ({
    addTextToTextArea(variableName: string) {
      let textBeforeCursorPosition = props.value.substring(0, caretPosition);
      let textAfterCursorPosition = props.value.substring(
        caretPosition,
        props.value.length
      );
      let newValue =
        textBeforeCursorPosition + variableName + textAfterCursorPosition;
      props.onChange(newValue);
      setCaretPosition(caretPosition + variableName.length);
    }
  }));

  const onChange = (event: any) => {
    setCaretPosition(event.target.selectionStart);
    props.onChange(event.target.value);
  };

  const onClick = (event: any) => {
    setCaretPosition(event.target.selectionStart);
  };

  const onKeyDown = (event: any) => {
    console.log(event.target.selectionEnd);
    setCaretPosition(event.target.selectionStart);
  };

  return type === 'area' ? (
    <textarea
      {...props}
      onClick={onClick}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={props.className}
    />
  ) : (
    <input
      {...props}
      onClick={onClick}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={props.className}
    />
  );
});

CustomTextInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func
};

export default CustomTextInput;
