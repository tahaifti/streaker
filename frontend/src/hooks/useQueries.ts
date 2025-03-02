import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchStreaks, fetchLongestStreak, fetchAllActivities, addActivity, fetchUserProfile, updateUserProfile, changePassword } from '../utils/api'

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