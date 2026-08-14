import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   'Cache-Control': 'no-cache, no-store, must-revalidate',
  //   Pragma: 'no-cache',
  //   Expires: '0',
  // },
})
