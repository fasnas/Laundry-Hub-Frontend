import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  endpoints: (builder) => ({
    getFilteredItems: builder.query({
      query: ({ category, service }) => 
        `/filtereditems?category=${encodeURIComponent(category)}&service=${encodeURIComponent(service)}`,
    }),
  }),
});

export const { useGetFilteredItemsQuery } = serviceApi;