import axiosInstance from '../../../utils/axiosInstance';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ModalButton } from '../../library/button';
import { useNotification } from '../../../Notifications/NotificationProvider';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  DB_CREDENTIALS,
  SERVICE_TYPES
} from '../../../redux/types/credentials';

const defaultFormData = {
  parameter_type: 'credentials',
  host: '',
  database: '',
  port: 5432,
  user: '',
  password: ''
};

const AddPostgreSQL = (props: any) => {
  const notification = useNotification();
  const router = useRouter();
  const { open, closeModal, isReconfigure, isOnboarding } = props;
  const credentials = useSelector((state: RootState) => state.credentials);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isReconfigure || !isOnboarding) {
      dispatch.credentials.LOAD_CREDENTIALS('postgres');
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const connect = () => {
    setIsSubmitting(true);

    axiosInstance
      .post('/v1/settings/set_connection_url', formData)
      .then(() => {
        closeModal();
        dispatch.credentials.ADD_CREDENTIALS({
          service_name: SERVICE_TYPES.POSTGRES,
          credentials: formData
        });
        notification({
          status: 'success',
          title: `PostgreSQL ${isReconfigure ? 'Reconfigured' : 'Connected'}`,
          description: `Your PostgreSQL database is ${
            isReconfigure ? 'reconfigured' : 'connected'
          } successfully`
        });
        setIsSubmitting(false);
        if (props.isOnboarding) {
          router.replace('/connect/usertable');
        }
      })
      .catch(error => {
        const errorDetails = error.response?.data?.detail;
        notification({
          title: 'Failed',
          description: errorDetails.message,
          status: 'danger'
        });
        setIsSubmitting(false);
      })
      .finally(() => {
        setFormData(defaultFormData);
      });
  };

  const [formData, setFormData] = useState<DB_CREDENTIALS>(defaultFormData);

  useEffect(() => {
    if (isReconfigure && open) {
      console.log(
        'Fetched credentials for postgres',
        JSON.stringify(credentials['postgres'])
      );

      setFormData(credentials['postgres'] as DB_CREDENTIALS);
    }
  }, [isReconfigure]);

  useEffect(() => {
    setFormData(defaultFormData);
  }, []);

  const handleFormData = (e: any) => {
    let form: any = { ...formData };
    form[e.target.name] = e.target.value;
    setFormData(form);
  };

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container">
        <div className="modal_header">
          <p className="modal_title">
            {isReconfigure ? 'Reconfigure' : 'Connect'} your PostgreSQL database
          </p>
          <img
            src="/icons/cross_black.svg"
            className="ml-10 cursor-pointer"
            onClick={closeModal}
            data-cy="closeDB"
          />
        </div>
        <div className="modal_content">
          <form>
            <div className="v_stack">
              <div className="h_stack mb-1.5">
                <label className="input_label w-[5rem]" htmlFor="host">
                  Host
                </label>
                <input
                  type="text"
                  className="modal_input"
                  placeholder="Hostname"
                  name="host"
                  id="host"
                  value={formData.host}
                  autoComplete="off"
                  onChange={handleFormData}
                  data-cy="hostInput"
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label w-20" htmlFor="database">
                  Database
                </label>
                <input
                  type="text"
                  className="modal_input"
                  placeholder="Database"
                  name="database"
                  id="database"
                  value={formData.database}
                  autoComplete="off"
                  onChange={handleFormData}
                  data-cy="databaseInput"
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label w-20" htmlFor="port">
                  Port
                </label>
                <input
                  type="number"
                  className="modal_input"
                  placeholder="Port"
                  name="port"
                  id="port"
                  value={formData.port}
                  autoComplete="off"
                  onChange={handleFormData}
                  data-cy="portInput"
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label w-20" htmlFor="user">
                  User
                </label>
                <input
                  type="text"
                  className="modal_input"
                  placeholder="User"
                  name="user"
                  id="user"
                  value={formData.user}
                  autoComplete="off"
                  onChange={handleFormData}
                  data-cy="userInput"
                />
              </div>
              <div className="h_stack mb-1.5">
                <label className="input_label w-20" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  className="modal_input"
                  placeholder="Password"
                  name="password"
                  id="password"
                  value={formData.password}
                  autoComplete="off"
                  onChange={handleFormData}
                  data-cy="passwordInput"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal_footer" data-cy="addPostgres">
          <ModalButton onClick={connect} isLoading={isSubmitting}>
            {isReconfigure ? 'Reconfigure' : 'Connect'}
          </ModalButton>
        </div>
      </div>
    </div>
  );
};

AddPostgreSQL.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  isReconfigure: PropTypes.bool,
  setIsReconfigure: PropTypes.func,
  isOnboarding: PropTypes.bool
};

export default AddPostgreSQL;
