import { useApi } from './request'

export const useAuthApi = () => {
  const api = useApi()

  return {
    login: (empno: string, password: string) =>
      api.post('/auth/login', { empno, password }),

    logout: () =>
      api.post('/auth/logout'),

    me: () =>
      api.get('/auth/me'),

    changePassword: (oldPassword: string, newPassword: string) =>
      api.post('/auth/change-password', { oldPassword, newPassword, confirmPassword: newPassword }),

    accountExists: (empno: string) =>
      api.get('/auth/account/exists', { params: { empno } }),

    applyProvider: (data: any) =>
      api.post('/providers/apply', data),

    register: (data: any) =>
      api.post('/auth/register', data),

    updateProfile: (data: any) =>
      api.put('/auth/me', data),
  }
}