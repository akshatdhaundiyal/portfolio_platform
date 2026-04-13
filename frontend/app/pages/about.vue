<script setup>
definePageMeta({
  layout: 'client-default'
})

const experience = [
  {
    role: 'Data Scientist',
    company: 'EXL Service',
    period: 'December 2021 — Present',
    highlights: [
      'Frequency and Severity Pricing Model: Created a Frequency model in a Frequency-Severity Model used in a pricing model. Improved the integration of external datasets to the client internal data by 20%.',
      'Audit Recommendation Model: Created audit recommending models using GLMs to recommend audit kind, expecting a $12M increase in Audit Premium annually with $0.05M reduction in expenses.',
      'Claims Text Analytics: Created an NLP project to summarize claim notes into relevant text flags, productionized in Google Vertex AI using spaCy, Sentence Transformers, and BERT via Hugging Face.',
      'Property Assessment: Created and managed a Looker-based product for Risk Control assessment using CV and LLMs with ~85% accuracy.',
      'Distribution Projects: Created Analysis Dashboards for VP & C-Suite using Python and Airflow DAGs.'
    ]
  },
  {
    role: 'Data Scientist',
    company: 'Networth Corp',
    period: 'September 2019 — November 2020',
    highlights: [
      'Forecasted the Returns in inventory across many SKUs using gradient boosting algorithms.',
      'Explored viable approaches for a 5% improvement in forecast accuracy.',
      'Created alternative dashboards for output presentation using Dash (Python).'
    ]
  }
]

const education = {
  institution: 'Manipal Institute of Technology, Manipal',
  degree: 'B.Tech Electronics and Communication with Minors in Digital Signal Processing',
  period: '2015-2019'
}

const skills = [
  'Python', 'Machine Learning', 'SQL', 'PowerBI', 'Google Looker', 'Airflow', 'NLP', 'GLMs', 'Hugging Face', 'spaCy', 'Vertex AI', 'Dash'
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
    
    <!-- Header -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        About Me
      </h1>
      <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">
        My professional journey, education, and technical expertise.
      </p>
    </div>

    <!-- Experience Timeline -->
    <section class="mb-20">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
        <UIcon name="i-heroicons-briefcase" class="text-primary-500 w-7 h-7" /> Professional Experience
      </h2>
      
      <div class="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-12">
        <div v-for="(job, index) in experience" :key="index" class="relative pl-8 group">
          <div class="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 group-hover:scale-125 group-hover:bg-primary-500 transition-all"></div>
          
          <div class="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/50">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ job.role }}</h3>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <p class="text-primary-600 dark:text-primary-400 font-semibold">{{ job.company }}</p>
              <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 sm:mt-0">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" /> {{ job.period }}
              </span>
            </div>
            
            <ul class="space-y-3 mt-4 text-gray-600 dark:text-gray-300">
              <li v-for="(point, i) in job.highlights" :key="i" class="flex items-start">
                <span class="mr-2 mt-1.5 text-primary-500 text-xs shadow-sm rounded-full">●</span>
                <span class="leading-relaxed">{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="mb-20">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
        <UIcon name="i-heroicons-academic-cap" class="text-primary-500 w-7 h-7" /> Education
      </h2>
      <UCard 
        class="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ education.degree }}</h3>
            <p class="text-primary-600 dark:text-primary-400 font-medium mt-1">{{ education.institution }}</p>
          </div>
          <span class="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {{ education.period }}
          </span>
        </div>
      </UCard>
    </section>

    <!-- Skills -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
        <UIcon name="i-heroicons-wrench-screwdriver" class="text-primary-500 w-7 h-7" /> Technical Skills
      </h2>
      <div class="flex flex-wrap gap-3">
        <UBadge 
          v-for="skill in skills" 
          :key="skill"
          size="lg"
          color="gray"
          variant="solid" 
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-default"
        >
          {{ skill }}
        </UBadge>
      </div>
    </section>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>