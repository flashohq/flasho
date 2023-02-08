import axiosInstance from '../../../utils/axiosInstance';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import EmailTemplates from '../../../components/email-templates';
import Email from '../../../components/layout/email';
import style from '../Style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const Templates = () => {
  const router = useRouter();
  const { trigger_id } = router.query;

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="relative flex h-16 w-full items-center justify-center bg-gray text-2xl font-semibold text-black">
        <img
          src={'/icons/back_blue.svg'}
          className="absolute left-2 h-8 w-8 cursor-pointer object-contain"
          onClick={() => router.back()}
        />
        Templates
      </div>
      <div className={style.main_content}>
        <div className={style.main_content_wrap}>
          <EmailTemplates triggerId={trigger_id} />
        </div>
      </div>
    </div>
  );
};

Templates.getLayout = (page: ReactElement) => {
  return <Email>{page}</Email>;
};

export async function getServerSideProps(context: any) {
  return {
    props: {}
  };
}

export default Templates;
