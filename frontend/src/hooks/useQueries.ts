import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchStreaks, fetchLongestStreak, fetchAllActivities, addActivity } from '../utils/api'

export function useStreaks(token: string) {
  return useQuery({
    queryKey: ['streaks'],
    queryFn: () => fetchStreaks(token),
    enabled: !!token
  })
}

export function useLongestStreak(token: string) {
  return useQuery({
    queryKey: ['longestStreak'],
    queryFn: () => fetchLongestStreak(token),
    enabled: !!token
  })
}

export function useAllActivities(token : string, page : number, limit : number) {
    return useQuery({
        queryKey: ['allActivities', page, limit],
        queryFn: () => fetchAllActivities(token, page, limit),
        enabled: !!token,
        placeholderData: (previousData) => previousData
    })
}

export function useActivities(token: string, page: number, limit: number) {
  return useQuery({
    queryKey: ['activities', page, limit],
    queryFn: () => fetchAllActivities(token, page, limit),
    enabled: !!token,
    placeholderData: (previousData) => previousData
  })
}

export function useAddActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ token, description }: { token: string, description: string }) => 
      addActivity(token, description),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['allActivities'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['streaks'] })
    }
  })
}