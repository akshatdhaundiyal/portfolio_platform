<script setup lang="ts">
definePageMeta({
  layout: 'client-default'
})

const { data: invoices, pending } = useApi<any[]>('/invoices/me')

// Summary totals
const summary = computed(() => {
  const inv = (invoices.value || []) as any[]
  return {
    total: inv.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0),
    paid: inv.filter((i: any) => i.status === 'paid').reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0),
    outstanding: inv.filter((i: any) => i.status !== 'paid').reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0)
  }
})

const columns = [
  { key: 'invoice_number', label: 'Invoice #' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'due_date', label: 'Due Date' }
]

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
  <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <!-- Branding & Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Financial <span class="text-primary-500">Center</span></h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Review your invoices, track payments, and access project receipts.</p>
      </div>
      <div class="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
        <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        <div>
          <p class="text-[10px] uppercase tracking-widest font-bold text-primary-600 dark:text-primary-400">Secure Payments</p>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Enterprise Encryption Active</p>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200/50 dark:border-gray-700/50">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Billed</p>
        <p class="text-3xl font-black mt-1 text-gray-900 dark:text-white">{{ formatCurrency(summary.total) }}</p>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200/50 dark:border-gray-700/50">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Paid</p>
        <p class="text-3xl font-black mt-1 text-green-600 dark:text-green-400">{{ formatCurrency(summary.paid) }}</p>
      </UCard>

      <UCard class="bg-gradient-to-br from-white to-primary-50/30 dark:from-gray-800 dark:to-primary-900/10 border-primary-100/50 dark:border-primary-800/50 ring-2 ring-primary-500/5">
        <p class="text-sm font-medium text-primary-600 dark:text-primary-400">Outstanding Balance</p>
        <p class="text-3xl font-black mt-1 text-primary-700 dark:text-white">{{ formatCurrency(summary.outstanding) }}</p>
      </UCard>
    </div>

    <!-- Invoices Table -->
    <UCard class="overflow-hidden border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">Billing History</h3>
        </div>
      </template>

      <UTable :columns="columns" :rows="(invoices as any[]) || []" :loading="pending">
        <template #invoice_number-data="{ row }">
          <span class="font-mono font-bold text-primary-600 dark:text-primary-400">{{ row.invoice_number }}</span>
        </template>

        <template #amount-data="{ row }">
          <span class="font-bold">{{ formatCurrency(row.amount) }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="soft" class="capitalize px-3 py-1 rounded-full">
            {{ row.status }}
          </UBadge>
        </template>

        <template #due_date-data="{ row }">
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ formatDate(row.due_date) }}</span>
            <span v-if="row.status === 'unpaid'" class="text-[10px] text-gray-400 italic">Payment due in 14 days</span>
          </div>
        </template>
      </UTable>

      <template v-if="!(invoices as any[])?.length && !pending" #default>
        <div class="py-12 text-center">
          <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No invoices found for your account.</p>
        </div>
      </template>
    </UCard>

    <!-- Help Selection -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-3xl bg-white/20 dark:bg-gray-800/20 border border-gray-200/30 dark:border-gray-700/30">
        <h4 class="font-bold mb-2">Billing Questions?</h4>
        <p class="text-sm text-gray-500 mb-4">If you have any questions regarding your invoices or payment terms, please contact your project manager directly via the dashboard messaging channel.</p>
        <UButton color="gray" variant="solid" label="Go to Messages" to="/client" />
      </div>
      <div class="p-6 rounded-3xl bg-primary-600/5 dark:bg-primary-400/5 border border-primary-500/10 dark:border-primary-400/10">
        <h4 class="font-bold mb-2">Payment Methods</h4>
        <p class="text-sm text-gray-500 mb-4">We currently accept Stripe, PayPal, and direct bank transfers. Please ensure you include your invoice number in the payment reference.</p>
        <div class="flex gap-4 opacity-50 grayscale">
          <UIcon name="i-heroicons-credit-card" class="w-8 h-8" />
          <UIcon name="i-heroicons-building-library" class="w-8 h-8" />
          <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8" />
        </div>
      </div>
    </div>

  </div>
</template>
