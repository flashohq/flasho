import Link from 'next/link';
import { Button } from '../../library/button';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const DraftEmail = (props: any) => {
  const { setMessageTabState } = props;

  const { isEdit, id: triggerId } = useSelector(
    (state: RootState) => state.trigger_drafts.current
  );
  return (
    <div className="relative h-full w-full flex-grow bg-white">
      <section className="step_header relative">
        <img
          src={'/icons/back_blue.svg'}
          className={'absolute left-2 h-6 w-6 cursor-pointer object-contain'}
          onClick={() => setMessageTabState('create')}
          data-cy="backBtn"
        />
        <h2>Create a new Email</h2>
      </section>
      <div className="flex flex-col items-center py-4">
        <div className="mt-4 flex items-center justify-center">
          <Link href={`/email-editor/${triggerId}`}>
            <Button
              text={!isEdit ? 'Create from Scratch' : 'Edit Template'}
              style={'mr-4 hover:bg-blue bg-gray2'}
            />
          </Link>

          <Link href={`/email-editor/templates/${triggerId}`}>
            <Button
              text={'Browse for templates'}
              style={'mr-4 hover:bg-blue bg-gray2'}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

DraftEmail.propTypes = {
  setMessageTabState: PropTypes.func,
  triggerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isEdit: PropTypes.bool
};

export default DraftEmail;
