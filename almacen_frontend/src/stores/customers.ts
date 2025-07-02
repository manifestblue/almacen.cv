import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer } from '@/types/customer'
import axios from 'axios'

export const useCustomersStore = defineStore('customers', () => {
  // State
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchTerm = ref('')
  const sortBy = ref<keyof Customer>('probabilidad_alto_valor')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  // Filtro principal: 'all' | 'highValue' | 'risk'
  const filterType = ref<'all' | 'highValue' | 'risk'>('all')

  // API URL
  const API_URL = 'https://tinq9oan6l.execute-api.us-east-1.amazonaws.com/analisis-clientes'

  // Getters
  const filteredCustomers = computed(() => {
    let filtered = customers.value

    // Primera capa: filtro principal
    if (filterType.value === 'highValue') {
      filtered = filtered.filter(c => c.probabilidad_alto_valor >= 0.75)
    } else if (filterType.value === 'risk') {
      filtered = filtered.filter(c => c.probabilidad_alto_valor < 0.4)
    }

    // Segunda capa: filtro por ID exacto si searchTerm es numérico
    const sanitized = searchTerm.value.trim()
    if (sanitized !== '') {
      if (/^\d+$/.test(sanitized)) {
        filtered = filtered.filter(c => c.CustomerID === Number(sanitized))
      }
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortBy.value]
      const bValue = b[sortBy.value]
      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    return filtered
  })

  const totalCustomers = computed(() => customers.value.length)
  const filteredCount = computed(() => filteredCustomers.value.length)

  // Actions
  const fetchCustomers = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get<Customer[]>(API_URL)
      customers.value = response.data
    } catch (err) {
      console.error('Error fetching customers:', err)
      error.value = 'Error al cargar los datos de clientes. Por favor, inténtalo de nuevo.'
    } finally {
      isLoading.value = false
    }
  }

  const setSearchTerm = (term: string) => {
    searchTerm.value = term
  }

  const setSort = (field: keyof Customer) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'desc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Métodos para cambiar el filtro principal
  const setFilterType = (type: 'all' | 'highValue' | 'risk') => {
    filterType.value = type
  }

  return {
    // State
    customers,
    isLoading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    filterType,
    
    // Getters
    filteredCustomers,
    totalCustomers,
    filteredCount,
    
    // Actions
    fetchCustomers,
    setSearchTerm,
    setSort,
    clearError,
    setFilterType
  }
}) 