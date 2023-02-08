import PropTypes from 'prop-types';

const Spinner = (props: any) => {
  return (
    <div>
      <div
        className={`h-24 w-24 animate-spin rounded-full border-8  border-r-dullwhite ${
          props.bg ? props.bg : 'border-red'
        }`}
      />
    </div>
  );
};

Spinner.propTypes = {
  bg: PropTypes.string
};

export default Spinner;
