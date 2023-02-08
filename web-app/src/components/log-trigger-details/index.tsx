import moment from 'moment';
import { useEffect, useState } from 'react';
import JSONPretty from 'react-json-pretty';
import { useRouter } from 'next/router';
import { Tab, Transition } from '@headlessui/react';
import Spinner from '../library/spinner/spinner';
import { Button } from '../library/button';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  TRIGGER_LOG_DETAILS,
  TRIGGER_LOG_ELEMENT
} from '../../redux/types/logs';

const Status_UI = (props: any) => {
  const { status } = props;
  if (status === 'PROCESSED') {
    return (
      <div className="flex w-full items-center">
        <div className="mr-2">
          <img src="/icons/processed.svg" className="h-6 w-6 object-contain" />
        </div>
        <div>
          <p className="text-[#1CC500]">Processed</p>
        </div>
      </div>
    );
  } else if (status === 'PROCESSING') {
    return (
      <div className="flex w-full items-center">
        <div className="mr-2">
          <img src="/icons/processing.svg" className="h-6 w-6 object-contain" />
        </div>
        <div>
          <p className="text-[#2E5CB2]">Processing</p>
        </div>
      </div>
    );
  } else if (status === 'PENDING') {
    return (
      <div className="flex w-full items-center">
        <div className="mr-2">
          <img src="/icons/pending.svg" className="h-6 w-6 object-contain" />
        </div>
        <div>
          <p className="text-[#FF9900]">Pending</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full items-center">
        <div className="mr-2">
          <img src="/icons/failed.svg" className="h-6 w-6 object-contain" />
        </div>
        <div>
          <p className="text-[#E63746]">Failed</p>
        </div>
      </div>
    );
  }
};

const TriggerLogElem = (props: any) => {
  const { id, created_at, payload, response, status, updated_at } = props;
  const [showReqRes, setShowReqRes] = useState<boolean>(false);

  return (
    <div className="w-full border border-[#c3cdd9]">
      <div className="grid h-12 grid-cols-12 bg-empty3 text-black">
        <div className="bg col-span-1 flex items-center justify-center border-r border-dullwhite">
          <div
            onClick={() => setShowReqRes(!showReqRes)}
            className={`${showReqRes && '-rotate-90'}`}
          >
            <img
              src={'/icons/caret_down.svg'}
              className={'h-6 w-6 object-contain'}
            />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center border-r border-dullwhite">
          <p className="font-medium text-black">{id}</p>
        </div>
        <div className="col-span-3 flex items-center justify-center border-r border-dullwhite">
          <p className="font-medium text-black">
            <Status_UI status={status} />
          </p>
        </div>
        <div className="col-span-3 flex items-center justify-center border-r border-dullwhite px-2">
          <p className="font-medium text-black">
            {moment(created_at, 'YYYY-MM-DD HH:mm Z').toString()}
          </p>
        </div>
        <div className="col-span-3 flex items-center justify-center px-2">
          <p className="font-medium text-black">
            {moment(updated_at, 'YYYY-MM-DD HH:mm Z').toString()}
          </p>
        </div>
      </div>
      <Transition
        show={showReqRes}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0 scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
      >
        <div className="h-[400px] w-full bg-white">
          <Tab.Group defaultIndex={0}>
            <Tab.List className={'flex h-12 w-full items-center px-4'}>
              <Tab className={'mr-4'}>
                {({ selected }) => (
                  <div
                    className={`inset-2 flex h-full items-center justify-center ${
                      selected && 'border-b-4 border-red'
                    }`}
                  >
                    <button
                      className={`bg-inherit py-2 font-semibold text-black ${
                        selected ? 'text-red' : 'text-black'
                      }`}
                    >
                      Request
                    </button>
                  </div>
                )}
              </Tab>
              <Tab>
                {({ selected }) => (
                  <div
                    className={`inset-2 flex h-full items-center justify-center ${
                      selected && 'border-b-4 border-red'
                    }`}
                  >
                    <button
                      className={`bg-inherit py-2 font-semibold text-black ${
                        selected ? 'text-red' : 'text-black'
                      }`}
                    >
                      Response
                    </button>
                  </div>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className={'h-[352px] w-full overflow-y-auto px-4'}>
              <Tab.Panel>
                <JSONPretty id={'json-pretty'} data={payload}></JSONPretty>
              </Tab.Panel>
              <Tab.Panel>
                <JSONPretty id={'json-pretty'} data={response}></JSONPretty>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Transition>
    </div>
  );
};

const LogTriggerDetails = (props: any) => {
  const [displayData, setDisplayData] = useState<TRIGGER_LOG_ELEMENT[]>([]);
  const [totalRows, setTotalRows] = useState<number>(10);
  const [pageRows, setPageRows] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const router = useRouter();

  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.logs.loading);
  const isFetching = useSelector((state: RootState) => state.logs.fetchingMore);
  const logs: TRIGGER_LOG_DETAILS | undefined = useSelector(
    (state: RootState) => {
      if (props.type === 'sms') {
        return state.logs.sms;
      } else return state.logs.email;
    }
  );

  useEffect(() => {
    setDisplayData(logs!.logs);
    logs && setTotalRows(logs.count);
    logs && setTotalPages(Math.ceil(logs.count / pageRows));
  }, [logs]);

  useEffect(() => {
    dispatch.logs.LOAD_LOGS({
      type: props.type,
      params: {
        offset: (pageNumber - 1) * pageRows,
        limit: pageRows
      }
    });
  }, []);

  const getTriggerLogsData = () => {
    dispatch.logs.LOAD_LOGS({
      type: props.type,
      params: {
        offset: (pageNumber - 1) * pageRows,
        limit: pageRows
      }
    });
    setDisplayData(logs!.logs);
  };

  const fetchMoreData = () => {
    dispatch.logs.LOAD_LOGS({
      type: props.type,
      params: {
        offset: (pageNumber - 1) * pageRows,
        limit: pageRows
      },
      isFetching: true
    });
    setDisplayData(logs!.logs);
  };

  useEffect(() => {
    getTriggerLogsData();
  }, []);

  const goToNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  useEffect(() => {
    if (pageNumber > totalPages) {
      setError(true);
    } else {
      fetchMoreData();
      setError(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(1);
    setTotalPages(Math.ceil(totalRows / pageRows));
    fetchMoreData();
  }, [pageRows]);

  useEffect(() => {
    console.log('Display Data', displayData);
  }, [displayData]);

  return isLoading ? (
    <div className="trigger_details_wrap flex items-center justify-center">
      <Spinner bg={'border-red'} />
    </div>
  ) : (
    <div className="relative h-full w-full pb-12">
      <div className="trigger_details_wrap">
        <div>
          <div className="flex h-12 w-full items-center justify-between text-lg font-medium">
            <div className="flex items-center">
              <p
                onClick={() => router.back()}
                className={'cursor-pointer text-blue'}
              >
                Trigger
              </p>
              <div>
                <img
                  src={'/icons/chevron_right.svg'}
                  className={'h-8 w-8 object-contain'}
                />
              </div>
              <p onClick={() => router.back()}>
                {`${
                  displayData.length > 0
                    ? displayData[0].trigger_name
                    : 'No logs'
                }`}
              </p>
            </div>
            <div
              onClick={fetchMoreData}
              className={` ${isFetching && 'animate-spin'}`}
            >
              {!isFetching ? (
                <img
                  src={'/icons/reload_blue.svg'}
                  className={'h-6 w-6 object-contain'}
                />
              ) : (
                <img
                  src={'/icons/loader.svg'}
                  className={'h-6 w-6 object-contain'}
                />
              )}
            </div>
          </div>

          <div className="grid h-12 w-full grid-cols-12 rounded bg-[#c3cdd9]">
            <div className="bg col-span-1 border-r border-dullwhite">{`    `}</div>
            <div className="col-span-2 flex items-center justify-center border-r border-dullwhite">
              <p className="text-lg font-semibold text-black">id</p>
            </div>
            <div className="col-span-3 flex items-center justify-center border-r border-dullwhite">
              <p className="text-lg font-semibold text-black">status</p>
            </div>
            <div className="col-span-3 flex items-center justify-center border-r border-dullwhite">
              <p className="text-lg font-semibold text-black">created at</p>
            </div>
            <div className="col-span-3 flex items-center justify-center">
              <p className="text-lg font-semibold text-black">updated at</p>
            </div>
          </div>
          <div className="flex w-full flex-col">
            {isFetching ? (
              <div className="flex h-96 w-full items-center justify-center">
                <Spinner bg={'border-blue'} />
              </div>
            ) : displayData.length > 0 ? (
              displayData.map((content: any, idx: number) => (
                <TriggerLogElem idx={idx} {...content} />
              ))
            ) : (
              <div className=" flex h-24 w-full items-center justify-center">
                <p className=" text-lg"> No logs found for this trigger.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 h-12 w-full ">
        {displayData.length > 0 && (
          <div className="flex items-center justify-center pt-1">
            <Button
              isDisabled={pageNumber === 1}
              onClick={goToPrevPage}
              text={'Prev'}
            />
            <form className="mx-3 flex items-center">
              <p className=" mx-2 font-medium">Page</p>
              <input
                className="flex w-16 items-center rounded border border-dullwhite p-2"
                type={'number'}
                value={pageNumber}
                onChange={(e: any) => setPageNumber(e.target.value)}
              />
              <p className="mx-2 font-medium">of {totalPages}</p>
              <select
                className="flex items-center rounded p-2 text-lg"
                value={pageRows}
                onChange={(e: any) => setPageRows(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </form>
            <Button
              isDisabled={pageNumber === totalPages}
              onClick={goToNextPage}
              text={'Next'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Status_UI.propTypes = {
  status: PropTypes.string
};

TriggerLogElem.propTypes = {
  id: PropTypes.string,
  created_at: PropTypes.any,
  payload: PropTypes.object,
  response: PropTypes.object,
  status: PropTypes.string,
  updated_at: PropTypes.any
};

LogTriggerDetails.propTypes = {
  type: PropTypes.string
};

export default LogTriggerDetails;
