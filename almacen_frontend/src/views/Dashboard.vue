<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Almacén.cv</h1>
            <p class="text-gray-600 mt-1">Marketing Intelligence Dashboard</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshData"
              :disabled="store.isLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon v-if="!store.isLoading" class="h-4 w-4 mr-2" />
              <div v-else class="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ store.isLoading ? 'Cargando...' : 'Actualizar' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button
          class="bg-white overflow-hidden shadow rounded-lg focus:outline-none transition ring-2 ring-indigo-500/50"
          :class="store.filterType === 'all' ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-300'"
          @click="store.setFilterType('all')"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Clientes</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ store.totalCustomers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </button>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <MagnifyingGlassIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Filtrados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ store.filteredCount }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <button
          class="bg-white overflow-hidden shadow rounded-lg focus:outline-none transition ring-2 ring-green-500/50"
          :class="store.filterType === 'highValue' ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-green-300'"
          @click="store.setFilterType('highValue')"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ChartBarIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Alto Valor (>75%)</dt>
                  <dd class="text-lg font-medium text-green-600">{{ highValueCount }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </button>

        <button
          class="bg-white overflow-hidden shadow rounded-lg focus:outline-none transition ring-2 ring-red-500/50"
          :class="store.filterType === 'risk' ? 'ring-2 ring-red-500' : 'hover:ring-2 hover:ring-red-300'"
          @click="store.setFilterType('risk')"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Riesgo (<40%)</dt>
                  <dd class="text-lg font-medium text-red-600">{{ riskCount }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="store.error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ store.error }}</p>
            </div>
            <div class="mt-4">
              <button
                @click="clearError"
                class="text-sm font-medium text-red-800 hover:text-red-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Controls -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div class="flex-1 max-w-lg">
              <label for="search" class="sr-only">Buscar cliente</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  v-model="store.searchTerm"
                  type="text"
                  placeholder="Buscar por ID de cliente..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white shadow rounded-lg overflow-x-auto">
        <div class="px-4 py-5 sm:p-6">
          <!-- Loading State -->
          <div v-if="store.isLoading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse">
              <div class="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>

          <!-- Table Content -->
          <div v-else-if="store.filteredCustomers.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    @click="setSort(column.key)"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div class="flex items-center space-x-1">
                      <span>{{ column.label }}</span>
                      <div class="flex flex-col">
                        <ChevronUpIcon 
                          class="h-3 w-3" 
                          :class="store.sortBy === column.key && store.sortOrder === 'asc' ? 'text-indigo-600' : 'text-gray-300'"
                        />
                        <ChevronDownIcon 
                          class="h-3 w-3 -mt-1" 
                          :class="store.sortBy === column.key && store.sortOrder === 'desc' ? 'text-indigo-600' : 'text-gray-300'"
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="customer in paginatedCustomers"
                  :key="customer.CustomerID"
                  class="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ customer.CustomerID }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ customer.Recency }} días
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ customer.Frequency }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ customer.Monetary.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ customer.ticket_promedio.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ customer.dias_desde_primera_compra }} días
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-1 mr-2">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="h-2 rounded-full transition-all duration-300"
                            :class="getProbabilityColor(customer.probabilidad_alto_valor)"
                            :style="{ width: `${customer.probabilidad_alto_valor * 100}%` }"
                          ></div>
                        </div>
                      </div>
                      <span 
                        class="text-sm font-medium"
                        :class="getProbabilityTextColor(customer.probabilidad_alto_valor)"
                      >
                        {{ (customer.probabilidad_alto_valor * 100).toFixed(1) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ store.searchTerm ? 'Intenta con un ID de cliente diferente.' : 'No hay datos disponibles.' }}
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="store.filteredCustomers.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ startIndex + 1 }}</span>
                a
                <span class="font-medium">{{ endIndex }}</span>
                de
                <span class="font-medium">{{ store.filteredCount }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import type { Customer } from '@/types/customer'
import {
  UsersIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Store
const store = useCustomersStore()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 20

const highValueCount = computed(() => 
  store.customers.filter(c => c.probabilidad_alto_valor > 0.75).length
)

const riskCount = computed(() => 
  store.customers.filter(c => c.probabilidad_alto_valor < 0.4).length
)

const totalPages = computed(() => 
  Math.ceil(store.filteredCount / itemsPerPage)
)

const startIndex = computed(() => 
  (currentPage.value - 1) * itemsPerPage
)

const endIndex = computed(() => 
  Math.min(startIndex.value + itemsPerPage, store.filteredCount)
)

const paginatedCustomers = computed(() => 
  store.filteredCustomers.slice(startIndex.value, startIndex.value + itemsPerPage)
)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Table columns configuration
const columns = [
  { key: 'CustomerID' as keyof Customer, label: 'ID Cliente' },
  { key: 'Recency' as keyof Customer, label: 'Recencia' },
  { key: 'Frequency' as keyof Customer, label: 'Frecuencia' },
  { key: 'Monetary' as keyof Customer, label: 'Gasto Total' },
  { key: 'ticket_promedio' as keyof Customer, label: 'Ticket Promedio' },
  { key: 'dias_desde_primera_compra' as keyof Customer, label: 'Días Cliente' },
  { key: 'probabilidad_alto_valor' as keyof Customer, label: 'Prob. Alto Valor' }
]

// Methods
const refreshData = () => {
  currentPage.value = 1
  store.fetchCustomers()
}

const clearError = () => {
  store.clearError()
}

const setSort = (field: keyof Customer) => {
  store.setSort(field)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const getProbabilityColor = (probability: number) => {
  if (probability >= 0.75) return 'bg-green-500'
  if (probability >= 0.4) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getProbabilityTextColor = (probability: number) => {
  if (probability >= 0.75) return 'text-green-600'
  if (probability >= 0.4) return 'text-yellow-600'
  return 'text-red-600'
}

// Watch for search changes to reset pagination
watch(() => store.searchTerm, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  store.fetchCustomers()
})
</script> 