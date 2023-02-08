import axiosInstance from '../../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import Select, { GroupBase } from 'react-select';
import { ModalButton } from '../../library/button';
import { useNotification } from '../../../Notifications/NotificationProvider';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { UserTableForm } from '../../user-table-form';

const AddUserTable = (props: any) => {
  const { open, closeModal } = props;
  const notification = useNotification();
  const dispatch = useDispatch();
  const {
    primary_key_column: primaryKeyColumn,
    isSubmitting,
    action
  } = useSelector((state: RootState) => state.user_table);

  useEffect(() => {
    if (action === 'close_modal') {
      notification({
        title: `Users table added`,
        status: 'success'
      });
      closeModal(false);
    }
  }, [action]);

  const handleSubmit = () => {
    if (primaryKeyColumn && primaryKeyColumn !== '') {
      dispatch.user_table.setUserTable();
    } else {
      notification({
        title: 'Failed, please try again',
        status: 'danger'
      });
      dispatch.user_table.setUserTable({ key: 'isSubmitting', value: false });
    }
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">Add UserTable</p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="modal_content">
          <UserTableForm />
        </div>
        <div className="modal_footer">
          <ModalButton onClick={handleSubmit} isLoading={isSubmitting}>
            Done
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

AddUserTable.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func
};

export default AddUserTable;
