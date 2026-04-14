<script setup lang="ts">
definePageMeta({
  layout: 'admin-default'
})

// Data State
const { data: invoices, refresh: refreshInvoices, pending } = useApi<any[]>('/invoices')
const { data: projects } = useApi<any[]>('/projects')

// Modal States
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedInvoice = ref<any>(null)
const loading = ref(false)

// Form State
const newInvoice = ref({
  invoice_number: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
  amount: 0,
  description: '',
  due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  project_id: undefined as number | undefined,
  status: 'unpaid'
})

// Calculations
const stats = computed(() => {
  const inv = (invoices.value || []) as any[]
  return {
    total: inv.length,
    outstanding: inv.filter((i: any) => i.status === 'unpaid').reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0),
    paid: inv.filter((i: any) => i.status === 'paid').reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0),
    overdue: inv.filter((i: any) => i.status === 'overdue').length
  }
})

// Table Configuration
const columns = [
  { key: 'invoice_number', label: 'Invoice #', sortable: true },
  { key: 'project', label: 'Project' },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'due_date', label: 'Due Date', sortable: true },
  { key: 'actions', label: 'Actions' }
]

const statusOptions = [
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' }
]

// Methods
async function handleCreate() {
  if (!newInvoice.value.project_id) return
  
  const { public: { apiBase } } = useRuntimeConfig()
  loading.value = true
  try {
    await $fetch(`${apiBase}/invoices`, {
      method: 'POST',
      body: newInvoice.value,
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    isCreateModalOpen.value = false
    await refreshInvoices()
    // Reset form
    newInvoice.value = {
      invoice_number: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      amount: 0,
      description: '',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      project_id: undefined,
      status: 'unpaid'
    }
  } catch (err) {
    console.error('Failed to create invoice:', err)
  } finally {
    loading.value = false
  }
}

async function updateStatus(invoice: any, newStatus: string) {
  const { public: { apiBase } } = useRuntimeConfig()
  try {
    await $fetch(`${apiBase}/invoices/${invoice.id}`, {
      method: 'PATCH',
      body: { status: newStatus },
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    await refreshInvoices()
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'paid': return 'green'
    case 'overdue': return 'red'
    default: return 'orange'
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <!-- Admin Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Invoicing <span class="text-primary-500">& Finance</span></h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage project billables, track payments, and monitor financial health.</p>
      </div>
      <UButton
        icon="i-heroicons-plus-circle"
        size="lg"
        color="primary"
        label="Draft New Invoice"
        class="shadow-lg shadow-primary-500/20"
        @click="isCreateModalOpen = true"
      />
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">Total Outstanding</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.outstanding) }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">Total Collected</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.paid) }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">Overdue Invoices</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.overdue }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">Total Drafted</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Invoice Ledger -->
    <UCard class="overflow-hidden border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">Invoice Ledger</h3>
          <div class="flex gap-2">
            <UInput icon="i-heroicons-magnifying-glass" placeholder="Search invoices..." size="sm" class="w-64" />
          </div>
        </div>
      </template>

      <UTable :columns="columns" :rows="(invoices as any[]) || []" :loading="pending">
        <template #project-data="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">{{ row.project?.title || 'Standalone' }}</span>
        </template>

        <template #amount-data="{ row }">
          <span class="font-mono font-bold">{{ formatCurrency(row.amount) }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="soft" class="capitalize px-2 py-0.5 rounded-full">
            {{ row.status }}
          </UBadge>
        </template>

        <template #due_date-data="{ row }">
          <span class="text-sm" :class="row.status === 'overdue' ? 'text-red-500 font-bold' : 'text-gray-500'">
            {{ formatDate(row.due_date) }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UDropdown :items="[
              [{ label: 'Mark as Paid', icon: 'i-heroicons-check', click: () => updateStatus(row, 'paid') }],
              [{ label: 'Mark as Overdue', icon: 'i-heroicons-clock', click: () => updateStatus(row, 'overdue') }],
              [{ label: 'Mark as Unpaid', icon: 'i-heroicons-arrow-path', click: () => updateStatus(row, 'unpaid') }],
              [{ label: 'Delete Invoice', icon: 'i-heroicons-trash', class: 'text-red-500 dark:text-red-400', click: () => {} }]
            ]">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Create Invoice Modal -->
    <UModal v-model="isCreateModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <UCard class="flex flex-col flex-1">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">Draft New Invoice</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isCreateModalOpen = false" />
          </div>
        </template>

        <form @submit.prevent="handleCreate" class="space-y-4 py-2">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Invoice Number" required>
              <UInput v-model="newInvoice.invoice_number" readonly disabled />
            </UFormGroup>
            <UFormGroup label="Amount ($)" required>
              <UInput v-model="newInvoice.amount" type="number" placeholder="1500" />
            </UFormGroup>
          </div>

          <UFormGroup label="Associated Project" required>
            <USelectMenu
              v-model="newInvoice.project_id"
              :options="(projects as any[]) || []"
              value-attribute="id"
              option-attribute="title"
              placeholder="Select a project"
            />
          </UFormGroup>

          <UFormGroup label="Description / Memo">
            <UTextarea v-model="newInvoice.description" placeholder="Project milestone 1, consultation fee, etc." />
          </UFormGroup>

          <UFormGroup label="Due Date" required>
            <UInput v-model="newInvoice.due_date" type="date" />
          </UFormGroup>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" label="Cancel" @click="isCreateModalOpen = false" />
            <UButton color="primary" label="Create Invoice" :loading="loading" @click="handleCreate" />
          </div>
        </template>
      </UCard>
    </UModal>

  </div>
</template>

<style scoped>
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
</style>
