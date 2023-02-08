import PropTypes from 'prop-types';

const Tags = (props: any) => {
  return (
    <div
      onClick={props.onClick}
      className={`relative m-1 flex h-9  min-w-[100px] cursor-pointer items-center justify-center rounded-lg p-2 pr-6 shadow-lg hover:shadow ${
        props.style && props.style
      }`}
    >
      <p className="font-semibold text-white">{props.text}</p>
      <img
        src={'/icons/cross_black.svg'}
        className={'absolute right-1 h-5 w-5 object-contain'}
      />
    </div>
  );
};

Tags.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.string,
  text: PropTypes.string
};

export default Tags;
