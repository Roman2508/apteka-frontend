import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api-client"

export interface User {
  id: number
  username: string
  full_name?: string
  email?: string
  role: "admin" | "director" | "pharmacist" | "senior_pharmacist"
  is_active: boolean
  createdAt: string
  updatedAt: string
  ownedPharmacy?: {
    id: number
    number: string
    address: string
    chain?: {
      id: number
      name: string
    }
  }
}

export interface CreateUserDto {
  username: string
  full_name?: string
  email?: string
  role: "admin" | "director" | "pharmacist" | "senior_pharmacist"
  password: string
  is_active?: boolean
  pharmacyChainId?: number
  pharmacyNumber?: string
  pharmacyAddress?: string
}

export interface UpdateUserDto {
  username?: string
  full_name?: string
  email?: string
  role?: "admin" | "director" | "pharmacist" | "senior_pharmacist"
  password?: string
  is_active?: boolean
  pharmacyChainId?: number
  pharmacyNumber?: string
  pharmacyAddress?: string
}

// Fetch all users with optional chain filter
export const useUsers = (chainId?: number) => {
  return useQuery({
    queryKey: ["users", chainId],
    queryFn: async () => {
      const params = chainId ? `?chainId=${chainId}` : ""
      const response = await api.get<User[]>(`/users${params}`)
      return response.data
    },
  })
}

// Fetch single user
export const useUser = (id: number | string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get<User>(`/users/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await api.post<User>("/users", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
    },
  })
}

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) => {
      // @ts-ignore
      const { ownedPharmacy, createdAt, updatedAt, ...rest } = data
      const response = await api.patch<User>(`/users/${id}`, rest)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] })
    },
  })
}

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
    },
  })
}
/* 
1. Оновлення (Update) з відкатом при помилці
У твоєму коді додаємо оптимістичне оновлення: змінюємо користувача локально одразу, а при помилці — повертаємо попередній стан.
tsxexport const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) => {
      // @ts-ignore
      const { ownedPharmacy, createdAt, updatedAt, ...rest } = data
      const response = await api.patch<User>(`/users/${id}`, rest)
      return response.data
    },
    // Оптимістичне оновлення
    onMutate: async (variables) => {
      const { id, data } = variables

      // Скасовуємо поточні запити, щоб не конфліктувати
      await queryClient.cancelQueries({ queryKey: ["users"] })
      await queryClient.cancelQueries({ queryKey: ["users", id] })

      // Зберігаємо попередній стан (для rollback)
      const previousUsers = queryClient.getQueryData<User[]>(["users"])
      const previousUser = queryClient.getQueryData<User>(["users", id])

      // Оптимістично оновлюємо список користувачів
      if (previousUsers) {
        queryClient.setQueryData<User[]>(["users"], previousUsers.map(user => 
          user.id === id ? { ...user, ...data } : user
        ))
      }

      // Оптимістично оновлюємо детальний користувач
      if (previousUser) {
        queryClient.setQueryData<User>(["users", id], { ...previousUser, ...data })
      }

      // Повертаємо контекст для onError
      return { previousUsers, previousUser }
    },
    // Відкат при помилці
    onError: (error, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(["users"], context.previousUsers)
      }
      if (context?.previousUser) {
        queryClient.setQueryData<User>(["users", variables.id], context.previousUser)
      }
      // Опціонально: показати тост з помилкою
    },
    // Успіх: інвалідуємо для рефетчу
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] })
    },
    // Опціонально: завжди після мутації (для очищення)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }) // Гарантовано синхронізуємо
    },
  })
}
  */

/* 
2. Створення (Create) з видаленням при помилці
При створенні: додаємо нову сутність локально одразу, при помилці — видаляємо її з кешу.
tsxexport const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await api.post<User>("/users", data)
      return response.data
    },
    onMutate: async (newUserData) => {
      await queryClient.cancelQueries({ queryKey: ["users"] })

      const previousUsers = queryClient.getQueryData<User[]>(["users"])

      // Оптимістично додаємо нового користувача (з тимчасовим id, якщо потрібно)
      const optimisticUser = { id: Date.now(), ...newUserData } // Тимчасовий id
      if (previousUsers) {
        queryClient.setQueryData<User[]>(["users"], [...previousUsers, optimisticUser])
      }

      return { previousUsers, optimisticUser }
    },
    onError: (error, newUserData, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(["users"], context.previousUsers)
      }
    },
    onSuccess: (createdUser) => {
      // Замінюємо тимчасовий на реальний (якщо потрібно)
      queryClient.setQueryData<User[]>(["users"], (old) => 
        old?.map(user => user.id === Date.now() ? createdUser : user) // Якщо був тимчасовий id
      )
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
*/

/* 
3. Видалення (Delete) з відновленням при помилці
При видаленні: видаляємо сутність локально, при помилці — повертаємо її назад.
tsxexport const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] })
      await queryClient.cancelQueries({ queryKey: ["users", id] })

      const previousUsers = queryClient.getQueryData<User[]>(["users"])
      const previousUser = queryClient.getQueryData<User>(["users", id])

      // Оптимістично видаляємо зі списку
      if (previousUsers) {
        queryClient.setQueryData<User[]>(["users"], previousUsers.filter(user => user.id !== id))
      }

      // Видаляємо детальний (якщо є)
      queryClient.setQueryData<User>(["users", id], undefined)

      return { previousUsers, previousUser, id }
    },
    onError: (error, id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(["users"], context.previousUsers)
      }
      if (context?.previousUser) {
        queryClient.setQueryData<User>(["users", context.id], context.previousUser)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
*/
