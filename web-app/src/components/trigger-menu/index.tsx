import TriggerHome from './trigger-home';
import PropTypes from 'prop-types';

const TriggerMenu = (props: any) => {
  const { mode } = props;

  return <TriggerHome mode={mode} />;
};

TriggerMenu.propTypes = {
  mode: PropTypes.string
};

export default TriggerMenu;
