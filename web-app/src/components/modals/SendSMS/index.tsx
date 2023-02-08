import { useNotification } from '../../../Notifications/NotificationProvider';
import axiosInstance from '../../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import router from 'next/router';
import { ModalButton, ModalButtonDisabled } from '../../library/button';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const SendSMS = (props: any) => {
  const { open, closeModal, foreignKeyColumn, smsTemplateId } = props;

  const dispatch = useDispatch();

  const {
    creation_status: creationStatus,
    isEdit,
    event,
    id
  } = useSelector((state: RootState) => state.trigger_drafts.current);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const notification = useNotification();
  const notificationID = 'submitTriggerNotification';

  console.log(foreignKeyColumn);
  const handleSubmitTriggers = () => {
    dispatch.sms_templates.CREATE_SMS_TEMPLATE({
      sms_template_id: smsTemplateId
    });
  };

  useEffect(() => {
    if (creationStatus === 'success' || creationStatus === 'update_success') {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: `Trigger ${
            isEdit ? 'update' : 'created'
          } successfully, redirecting...`,
          status: 'success'
        });
      }

      closeModal();

      setTimeout(() => {
        console.log('here', event);
        if (event === 'MANUAL') {
          dispatch.trigger_drafts.updateValue({
            key: 'activeTab',
            value: 'Integration'
          });
          router.replace(`/sms/${id}`);
        } else {
          router.replace(`/sms/all`);
        }
      }, 2000);
    } else if (
      creationStatus === 'failed' ||
      creationStatus === 'update_failed'
    ) {
      if (!notification.isActive(notificationID)) {
        notification({
          id: notificationID,
          title: `Some error occured, please try again`,
          status: 'danger'
        });
      }

      closeModal();
    }
  }, [creationStatus]);

  const handleUpdateTrigger = () => {
    dispatch.sms_templates.DO_UPDATE_SMS_TEMPLATE();
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Are you sure you want to continue?</p>
          <img
            src="/icons/cross_black.svg"
            className="cursor-pointer"
            onClick={closeModal}
            data-cy="closeSMS"
          />
        </div>
        <div className="modal_content my-5 px-9">
          <p className="py-2">
            This SMS will be sent to everyone in the selected audience.
          </p>
        </div>
        <div className="modal_footer" data-cy="sendSMS">
          {submitDisabled && <ModalButtonDisabled>Confirm</ModalButtonDisabled>}
          {!submitDisabled && (
            <ModalButton
              onClick={() => {
                if (!isEdit) {
                  handleSubmitTriggers();
                } else {
                  handleUpdateTrigger();
                }
              }}
              isLoading={
                creationStatus === 'creating' ||
                creationStatus === 'update_in_progress'
              }
            >
              Confirm
            </ModalButton>
          )}
        </div>
      </div>
    </div>
  );
};

SendSMS.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  messageService: PropTypes.string,
  phoneNumberColumns: PropTypes.object,
  smsTemplate: PropTypes.object,
  foreignKeyColumn: PropTypes.string,
  tableName: PropTypes.string,
  primaryVariables: PropTypes.object,
  derivedVariables: PropTypes.object,
  conditionsForm: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  typeOfTrigger: PropTypes.number,
  isEdit: PropTypes.bool,
  triggerId: PropTypes.string,
  smsTemplateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default SendSMS;
