import { useApi } from './request'

export const useRetouchApi = () => {
  const api = useApi()

  return {
    createJob: (
      orderId: number,
      consumerId: number,
      mediaAssetIds: string,
      spec = 'standard',
      fee = 0,
    ) =>
      api.post('/retouch/jobs', null, {
        params: { orderId, consumerId, mediaAssetIds, spec, fee },
      }),
  }
}
