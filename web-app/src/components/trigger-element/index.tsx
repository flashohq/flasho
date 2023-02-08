import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useNotification } from '../../Notifications/NotificationProvider';
import { Switch } from '../library/switch';
import { useEffect, useState } from 'react';
import DeleteTrigger from '../modals/DeleteTrigger';
import Router, { useRouter } from 'next/router';

export default (props: any) => {
  const router = useRouter();
  const [deleteTriggerModal, setDeleteTriggerModal] = useState<boolean>(false);

  const closeDeleteTriggerModal = () => {
    setDeleteTriggerModal(false);
  };

  const {
    id,
    title,
    name,
    active,
    language,
    preview,
    table_name: tableName,
    isDeleting,
    type,
    event
  } = props;

  const dispatch = useDispatch();

  const alterTrigger = (checked: boolean) => {
    const data = {
      operation: checked ? 'enable' : 'disable',
      trigger_id: id,
      trigger_name: name,
      table_name: tableName,
      event: event
    };

    dispatch.triggers.alter({ id, type, data });
  };

  const toast = useNotification();
  const toastId = 'triggerDeleteError';

  return (
    <>
      <DeleteTrigger
        open={deleteTriggerModal}
        closeModal={closeDeleteTriggerModal}
        id={id}
        type={type}
        isLoading={isDeleting}
      />
      <div
        className={
          'grid h-12 w-full cursor-default grid-cols-12 border border-b-gray bg-white text-black'
        }
      >
        <div
          className={`col-span-2 flex items-center px-2 pl-4 ${
            event === 'MANUAL' ? 'text-blue' : 'text-black'
          }`}
        >
          <p
            onClick={() => {
              if (event === 'MANUAL') {
                dispatch.trigger_drafts.addDraft({
                  id: id.toString(),
                  messageMode:
                    type === 'SMS'
                      ? 'sms'
                      : type === 'Trigger'
                      ? 'trigger'
                      : 'email',
                  activeTab: 'Integration'
                });
                dispatch.trigger_drafts.updateValue({
                  key: 'creation_status',
                  value: 'draft'
                });
                router.push(`/${type}/${id}`);
              }
            }}
          >
            {name}
          </p>
        </div>
        <div className="col-span-5 flex items-center pr-2">
          <p className="logs_preview">{preview}</p>
        </div>
        <div className="col-span-2 flex items-center justify-center">
          <p>{language == 0 && 'English'}</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <Switch
            checked={active}
            onChange={(event: { target: { checked: boolean } }) => {
              alterTrigger(event.target.checked);
            }}
          />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <IconButton
            aria-label={'delete trigger'}
            icon={<DeleteIcon />}
            onClick={() => {
              setDeleteTriggerModal(true);
              // dispatch.triggers.remove_trigger({ id, type });
            }}
            isLoading={isDeleting}
          />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <IconButton
            aria-label={'edit trigger'}
            icon={<EditIcon />}
            onClick={() => {
              dispatch.trigger_drafts.addDraft({
                id: id.toString(),
                messageMode:
                  type === 'SMS'
                    ? 'sms'
                    : type === 'Trigger'
                    ? 'trigger'
                    : 'email',
                activeTab: 'Variables'
              });
              dispatch.trigger_drafts.updateValue({
                key: 'creation_status',
                value: 'draft'
              });
              dispatch.trigger_drafts.updateValue({
                key: 'activeTab',
                value: 'Variables'
              });
              router.push(`/${type}/${id}`);
            }}
          />
        </div>
      </div>
    </>
  );
};
