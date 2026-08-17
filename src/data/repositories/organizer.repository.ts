import { api } from '../api/apiClient'

import type {
  OrganizerStats,
  OrganizerEventListResponse,
} from '../../types/organizer.types'

export const organizerRepository = {
  listEvents: () =>
    api.get<OrganizerEventListResponse>('/api/organizer/events'),
  getStats: () => api.get<OrganizerStats>('/api/organizer/stats'),
} as const
