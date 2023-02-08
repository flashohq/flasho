import stepps from './StepDesign.module.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../../redux/store';

const StepElement = (props: any) => {
  const { index, step, title, onClick, active, isDisabled } = props;
  return (
    <div
      key={index}
      className={cx(
        { [stepps.isFirst]: step === 1 },
        { [stepps.isActive]: active },
        { [stepps.isNotFirst]: step !== 1 }
      )}
      onClick={isDisabled ? null : onClick}
    >
      <div className={stepps.default}>
        <div
          className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
            active ? 'bg-honeydew' : 'bg-darkgray'
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              active ? 'text-blue' : 'text-honeydew'
            }`}
          >
            {step}
          </p>
        </div>
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-honeydew ">{title}</h2>
        </div>
      </div>
    </div>
  );
};

const TriggerController = (props: any) => {
  const { isEdit } = props;

  const { activeTab } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const { event } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );

  const dispatch = useDispatch();

  const steps = ['Triggers', 'Variables', 'Conditions', 'Channel', 'Message'];
  const stepsManual = [
    'Triggers',
    'Variables',
    'Channel',
    'Message',
    'Integration'
  ];

  return (
    <div className="flex items-center overflow-x-auto px-4 py-2">
      {event === 'MANUAL'
        ? stepsManual.map((title, index) => (
            <StepElement
              key={index}
              active={activeTab === title}
              step={index + 1}
              title={title}
              onClick={() =>
                dispatch.trigger_drafts.updateValue({
                  key: 'activeTab',
                  value: title
                })
              }
              isDisabled={
                (isEdit && index == 0) ||
                index > stepsManual.findIndex(item => item === activeTab)
              }
            />
          ))
        : steps.map((title, index) => (
            <StepElement
              key={index}
              active={activeTab === title}
              step={index + 1}
              title={title}
              onClick={() =>
                dispatch.trigger_drafts.updateValue({
                  key: 'activeTab',
                  value: title
                })
              }
              isDisabled={
                (isEdit && index == 0) ||
                index > steps.findIndex(item => item === activeTab)
              }
            />
          ))}
    </div>
  );
};

StepElement.propTypes = {
  index: PropTypes.number,
  step: PropTypes.number,
  title: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  isDisabled: PropTypes.bool
};

TriggerController.propTypes = {
  active: PropTypes.number,
  setActive: PropTypes.func,
  isEdit: PropTypes.bool
};

export default TriggerController;
