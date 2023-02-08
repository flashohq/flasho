import router from 'next/router';
import { ReactElement } from 'react';
import Onboarding from '../../components/layout/onboarding';
import { UserTableForm } from '../../components/user-table-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const UserTable = () => {
  const dispatch = useDispatch();
  const { primary_key_column: primaryKeyColumn, isSubmitting } = useSelector(
    (state: RootState) => state.user_table
  );

  const handleSubmit = () => {
    if (primaryKeyColumn.length > 0) {
      dispatch.user_table.setUserTable();
      router.replace('/connect/services');
    } else {
      router.replace('/connect/services');
    }
  };

  return (
    <div className="h-full w-full">
      <div className="relative flex h-full flex-col bg-white">
        <h2 className="flex h-16 items-center justify-center bg-gray text-xl font-medium text-black">
          Please select the user table
        </h2>
        <UserTableForm />
        <div className="flex h-16 w-full items-center justify-center">
          <button
            className="absolute bottom-8 flex h-12 w-32  items-center justify-center rounded bg-red text-xl font-semibold text-white"
            onClick={handleSubmit}
          >
            {primaryKeyColumn && primaryKeyColumn.length > 0 ? 'Next' : 'Skip'}
          </button>
        </div>
      </div>
    </div>
  );
};

UserTable.getLayout = (page: ReactElement) => {
  return <Onboarding>{page}</Onboarding>;
};

export default UserTable;
