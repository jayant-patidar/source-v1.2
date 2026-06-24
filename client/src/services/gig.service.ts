import api from './api';

export const getGigs = async (filters: any = {}) => {
  const { data } = await api.get('/gigs', { params: filters });
  return data;
};

export const getMyGigs = async () => {
  const { data } = await api.get('/gigs/my');
  return data;
};

export const getGigById = async (id: string) => {
  const { data } = await api.get(`/gigs/${id}`);
  return data;
};

export const createGig = async (gigData: any) => {
  const { data } = await api.post('/gigs', gigData);
  return data;
};

export const updateGig = async (id: string, gigData: any) => {
  const { data } = await api.put(`/gigs/${id}`, gigData);
  return data;
};

export const deleteGig = async (id: string) => {
  const { data } = await api.delete(`/gigs/${id}`);
  return data;
};

export const bookGig = async (id: string, bookingDetails: any) => {
  const { data } = await api.post(`/gigs/${id}/book`, bookingDetails);
  return data;
};
