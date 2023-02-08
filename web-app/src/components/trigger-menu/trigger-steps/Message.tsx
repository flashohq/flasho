import { useState } from 'react';
import CreateEmail from '../../create-email/CreateEmail';
import DraftEmail from '../../create-email/DraftEmail';
import CreateSMS from '../../create-sms/CreateSMS';
import DraftSMS from '../../create-sms/DraftSMS';
import PreviewSMS from '../../create-sms/PreviewSMS';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const Message = (props: any) => {
  const [messageTabState, setMessageTabState] = useState<string>('create');

  const {
    id: triggerId,
    email_template_id,
    isEdit
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  const messageMode =
    email_template_id === '' || !email_template_id ? 'SMS' : 'Email';

  return (
    <div className="h-full w-full flex-grow bg-white">
      {messageMode === 'SMS' && (
        <div className="h-full w-full">
          {messageTabState === 'create' && (
            <CreateSMS
              setMessageTabState={setMessageTabState}
              isEdit={isEdit}
            />
          )}
          {messageTabState === 'draft' && (
            <DraftSMS setMessageTabState={setMessageTabState} />
          )}
          {messageTabState === 'preview' && (
            <PreviewSMS setMessageTabState={setMessageTabState} />
          )}
        </div>
      )}
      {messageMode === 'Email' && (
        <div className="h-full w-full">
          {messageTabState === 'create' && (
            <CreateEmail
              setMessageTabState={setMessageTabState}
              isEdit={isEdit}
            />
          )}
          {messageTabState === 'draft' && (
            <DraftEmail
              setMessageTabState={setMessageTabState}
              triggerId={triggerId}
            />
          )}
        </div>
      )}
    </div>
  );
};

Message.propTypes = {
  triggerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Message;
