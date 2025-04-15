import { useUser } from './useUser'

const adminEmails: string[] = ['carameljjo@gmail.com', 'peterju35@gmail.com']

export const useGetIsAdminUser = (): boolean => {
  const { user } = useUser()

  return adminEmails.includes(user?.email)
}
