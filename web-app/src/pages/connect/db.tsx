import { ReactElement, useState } from 'react';
import Onboarding from '../../components/layout/onboarding';
import AddPostgreSQL from '../../components/modals/AddPostgreSQL';

const Database = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeModal = () => setOpenModal(false);

  return (
    <>
      <AddPostgreSQL
        open={openModal}
        closeModal={closeModal}
        isReconfigure={false}
        isOnboarding={true}
      />
      <div className="h-full w-full">
        <div className="flex h-full flex-col bg-white">
          <h2 className="flex h-16 items-center justify-center bg-gray text-xl font-medium text-black">
            Please connect your database
          </h2>
          <div className="mt-8 flex w-full flex-col items-center">
            <h2 className="mb-8 text-xl font-semibold text-blue">Database</h2>
            <div className="flex items-center">
              <button
                onClick={() => setOpenModal(true)}
                className="flex h-16 items-center justify-center rounded-md bg-[#a8dadc80] px-4"
                data-cy="addPostgreBtn"
              >
                <img
                  src="/icons/postgres.svg"
                  className="mr-2 h-6 w-6 object-contain"
                />
                <p className="text-xl font-medium text-black">PostgreSQL</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Database.getLayout = (page: ReactElement) => {
  return <Onboarding>{page}</Onboarding>;
};

export default Database;
