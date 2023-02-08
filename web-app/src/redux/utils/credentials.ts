import axiosInstance from '../../utils/axiosInstance';
import { CREDENTIALS } from '../types/credentials';

// function to fetch credetials of desired services
export const getCredentials = async (service_name: string) => {
  const data: CREDENTIALS = {};
  console.log('Fetching from getCredentials');
  const res = await axiosInstance.get(
    `/v1/settings/get_credentials/${service_name}`
  );
  const creds = await res.data;
  data[service_name] = creds;

  return data;
};
