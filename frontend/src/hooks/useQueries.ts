import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchStreaks, fetchLongestStreak, fetchAllActivities, addActivity, fetchUserProfile, updateUserProfile, changePassword } from '../utils/api'
import {Activity} from '@ifti_taha/streaker-common';
// Query keys
export const queryKeys = {
  streaks: 'streaks',
  longestStreak: 'longest-streak',
  activities: 'activities',
  allActivities: 'all-activities',
}

export function useStreaks(token: string) {
  return useQuery({
    queryKey: [queryKeys.streaks, token],
    queryFn: () => fetchStreaks(token),
    enabled: !!token,
  })
}

export function useLongestStreak(token: string) {
  return useQuery({
    queryKey: [queryKeys.longestStreak, token],
    queryFn: () => fetchLongestStreak(token),
    enabled: !!token,
  })
}

export function useAllActivities(token: string, page: number, limit: number, options?: { onSuccess?: (data: { activities: Activity[] }) => void }) {
  return useQuery({
    queryKey: [queryKeys.allActivities, token],
    queryFn: () => fetchAllActivities(token, page, limit),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
    ...options
  })
}

export function useActivities(token: string, page: number, limit: number) {
  return useQuery({
    queryKey: [queryKeys.activities, token, page, limit],
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
      queryClient.invalidateQueries({ queryKey: [queryKeys.activities] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.allActivities] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.streaks] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.longestStreak] })
    }
  })
}

export function useUser(token : string) {
    return useQuery({
        queryKey : ['user'],
        queryFn : () => fetchUserProfile(token),
        enabled : !!token,
        placeholderData : (previousData) => previousData
    })
}

interface profileDataType {
    name : string,
    username : string,
    email : string
}

export function useUpdateUser(){
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn : ({token, profileData} : {token : string, profileData : profileDataType}) => {
            return updateUserProfile(token, profileData)
        },
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ['user']})
        }
    })
}

export function useChangePassword(){
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn : ({token, oldPassword, newPassword} : {token : string, oldPassword : string, newPassword : string}) => {
            return changePassword(token, oldPassword, newPassword)
        },
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ['user']})
        }
    })
}