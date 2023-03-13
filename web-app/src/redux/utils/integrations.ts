import axiosInstance from '../../utils/axiosInstance';
import { INTEGRATIONS, LABELS, SERVICES } from '../types/integration';

// function to fetch list of integrations
export const getIntegrationList = async () => {
  const res = await axiosInstance.get('/v1/settings/get_integrations');
  const data = await res.data;
  return await structResponse(data);
};

// function to fetch the label based on the typeof Service
export const getServiceLabel = (name: string) => {
  return SERVICES[name as keyof LABELS];
};

// function to structure the response from getIntegrationList
export const structResponse = async (data: any) => {
  let currentIntegration: INTEGRATIONS = {
    db: [],
    sms: [],
    email: []
  };
  Object.keys(data.db).forEach(async integrationName => {
    currentIntegration.db.push({
      label: getServiceLabel(integrationName),
      value: integrationName,
      is_connected: data.db[integrationName]['is_connected']
    });
  });
  Object.keys(data.sms).forEach(async integrationName => {
    currentIntegration.sms.push({
      label: getServiceLabel(integrationName),
      value: integrationName,
      is_connected: data.sms[integrationName]['is_connected'],
      is_active: data.sms[integrationName]['is_active']
    });
  });
  Object.keys(data.email).forEach(async integrationName => {
    currentIntegration.email.push({
      label: getServiceLabel(integrationName),
      value: integrationName,
      is_connected: data.email[integrationName]['is_connected'],
      is_active: data.email[integrationName]['is_active']
    });
  });

  return currentIntegration;
};
