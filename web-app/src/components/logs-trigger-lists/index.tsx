import Link from 'next/link';
import { useEffect } from 'react';
import Spinner from '../library/spinner/spinner';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const TriggerListElem = (props: any) => {
  const { title, preview, language, id, idx, type } = props;
  return (
    <Link href={`/log/${type}/${id}`}>
      <div
        className={`grid h-12 w-full cursor-default grid-cols-12 text-black hover:bg-blue hover:text-honeydew ${
          idx % 2 == 1 && 'bg-dullwhite'
        }`}
      >
        <div className="col-span-2 flex items-center px-2 pl-4">
          <p>{title}</p>
        </div>
        <div className="col-span-8 flex items-center pr-2">
          <p className="logs_preview">{preview}</p>
        </div>
        <div className="col-span-2 flex items-center justify-center">
          <p>{language == 0 && 'English'}</p>
        </div>
      </div>
    </Link>
  );
};

const LogsTriggerLists = (props: any) => {
  const { type } = props;
  const triggerList: Record<string, any> = useSelector(
    (state: RootState) => state.triggers
  );
  const loading = useSelector((state: RootState) => state.triggers.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch.triggers.get_triggers(type);
  }, []);

  return (
    <div className="h-full w-full">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      ) : Object.keys(triggerList[type]).length !== 0 ? (
        <div className="flex h-full w-full flex-col pb-4">
          <div className="grid h-16 w-full grid-cols-12 rounded bg-gray">
            <div className="col-span-2 flex items-center">
              <p className="px-4 text-xl font-semibold text-black">Name</p>
            </div>
            <div className="col-span-8 flex items-center">
              <p className="text-xl font-semibold text-black">Preview</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <p className="px-4 text-lg font-semibold text-black">Language</p>
            </div>
          </div>
          <div className="trigger_log_wrap">
            {Object.keys(triggerList[type]).map((key: string, idx: number) => (
              <TriggerListElem
                {...{ ...triggerList[type][key], type }}
                idx={idx}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center p-4">
          <p>No triggers found.</p>
        </div>
      )}
    </div>
  );
};

TriggerListElem.propTypes = {
  title: PropTypes.string,
  preview: PropTypes.string,
  language: PropTypes.number,
  id: PropTypes.string,
  idx: PropTypes.number,
  type: PropTypes.string
};

LogsTriggerLists.propTypes = {
  type: PropTypes.string
};

export default LogsTriggerLists;
