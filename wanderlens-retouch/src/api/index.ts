import request from './request'

export default {
  login: (empno: string, password: string) =>
    request.post('/auth/login', { empno, password }),

  // 工單
  getJobs: (status?: string) =>
    request.get('/retouch/jobs', { params: { status } }),

  getJob: (id: number) =>
    request.get(`/retouch/jobs/${id}`),

  startProcessing: (id: number) =>
    request.post(`/retouch/jobs/${id}/start`),

  deliver: (id: number) =>
    request.post(`/retouch/jobs/${id}/deliver`),

  // RAW 下載（直接指向 media 服務，避免經過 Spring API proxy）
  getRawUrl: (assetId: string) =>
    request.get(`http://localhost:3004/raw/${assetId}`),

  // 成品上傳
  uploadResult: (jobId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post(`/files/upload/retouch_result/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}