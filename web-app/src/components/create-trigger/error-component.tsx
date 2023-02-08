import styles from '../trigger-menu/trigger-home/TriggerHome.module.scss';
import PropTypes from 'prop-types';

const ErrorComponent = (props: any) => {
  const { ErrorComponentName, mode } = props;
  return (
    <div className={styles.main_container}>
      <div className={styles.main_content_wrap}>
        <ErrorComponentName mode={mode} />
      </div>
    </div>
  );
};

ErrorComponent.propTypes = {
  ErrorComponentName: PropTypes.any,
  mode: PropTypes.string
};

export default ErrorComponent;
