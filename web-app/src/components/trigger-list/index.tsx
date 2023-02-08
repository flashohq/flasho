import { Box } from '@chakra-ui/react';
import Spinner from '../library/spinner/spinner';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import TriggerElement from '../trigger-element';
import style from './TriggerList.module.scss';
import { useRouter } from 'next/router';

export default (props: { type: 'email' | 'sms' }) => {
  const { type } = props;
  const router = useRouter();
  const triggers = useSelector((state: RootState) => state.triggers);

  const loading = useSelector((state: RootState) => state.triggers.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch.triggers.get_triggers(type);
  }, []);

  return (
    <div className={style.main_container}>
      <Box className={style.main_header} fontSize={'2xl'}>
        View and edit your triggers
        <img
          src="/icons/arrow-back.svg"
          onClick={() => router.back()}
          className="absolute left-4 h-8 w-8"
        />
      </Box>
      <div className="flex h-[90%] w-full items-center overflow-auto bg-white">
        {loading ? (
          <div className="flex w-full items-center justify-center">
            <Spinner />
          </div>
        ) : Object.keys(triggers[type]).length !== 0 ? (
          <div className="flex w-full flex-col pb-4">
            <div className="grid h-16 w-full grid-cols-12 rounded bg-white">
              <div className="col-span-2 flex items-center">
                <p className="px-4 text-xl font-semibold text-black">Name</p>
              </div>
              <div className="col-span-5 flex items-center">
                <p className="text-xl font-semibold text-black">Preview</p>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <p className="px-4 text-lg font-semibold text-black">
                  Language
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-center"></div>
              <div className="col-span-1 flex items-center justify-center"></div>
              <div className="col-span-1 flex items-center justify-center"></div>
            </div>
            <div className="trigger_log_wrap">
              {Object.keys(triggers[type]).map((key: string) => {
                return (
                  <TriggerElement
                    {...{ ...triggers[type][key], type: type }}
                    getTriggers={() => dispatch.triggers.get_triggers(type)}
                    // setTriggers={setTriggers}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center p-4">
            <p>
              No {type === 'email' ? 'Email' : type === 'sms' ? 'SMS' : ''}{' '}
              triggers created
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
