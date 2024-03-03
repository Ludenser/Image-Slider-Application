import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const _API_BASE_URL_ = import.meta.env.VITE_API_BASE_URL;
const _API_KEY_ = import.meta.env.VITE_API_KEY;

export interface CatImage {
  id:string,
  url:string,
  width:number,
  height:number,
  breeds:[],
  favourite:undefined
}


export const catApi = createApi({
  reducerPath: 'catApi',
  baseQuery: fetchBaseQuery({ baseUrl: _API_BASE_URL_, headers: {'x-api-key':_API_KEY_}}),
  endpoints: (builder) => ({
    getCats: builder.query<CatImage[], number | undefined>({
      query: (limit) => ({
        url: 'v1/images/search',
        params: {limit, size: 'medium'}
      }),
    }),
    getOneCat: builder.query<CatImage[], void>({
      query: () => ({
        url: 'v1/images/search',
        params: {limit: 1, size: 'medium'}
      }),
    }),
  }),
});

export const { useGetCatsQuery, useGetOneCatQuery  } = catApi;
