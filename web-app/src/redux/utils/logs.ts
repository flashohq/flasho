import axiosInstance from '../../utils/axiosInstance';

export interface TRIGGER_LOGS_PARARAMS {
  offset: number;
  limit: number;
}

export const getTriggerLogs = async (
  log_type: 'sms' | 'email',
  params: TRIGGER_LOGS_PARARAMS
) => {
  const data = await axiosInstance.get(`/v1/triggers/event_logs/${log_type}`, {
    params: params
  });

  const res = await data.data;
  const totalLogsCount = await axiosInstance.get(
    `/v1/triggers/event_logs/count/${log_type}`
  );
  const count = await totalLogsCount.data.count;
  return { logs: res, count: count };
};
