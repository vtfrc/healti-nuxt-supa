<script setup>
import { v4 as uuidv4 } from "uuid";

import ocrService from '~/services/ocr';
import nlpService from '~/services/nlp';

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const pdfUploadRef = ref(null);
const metrics = ref([])

const pdfStatusMessage = ref('')
const statusMessage = ref('')
const pdfIsLoading = ref(false)
const isLoading = ref(false)

async function handlePDFUpload() {
  pdfIsLoading.value = true

  const pdfFile = pdfUploadRef.value.files[0];
  if (!pdfFile) return;

  try {
    // OCR the PDF
    const ocrText = await ocrService(pdfFile);

    // NLP to extract medical metrics
    const parsedMetrics = await nlpService(ocrText);
    console.log(parsedMetrics);

    // Writing each metric and its value (if not null) to the database
    for (const metric of parsedMetrics) {
      if (metric.valorization !== null) {
        const { data, error: queryError } = await supabase
        .from('metric_names')
        .select('id')
        .eq('name', metric.name)
        .single();

        if (queryError) throw queryError;

        const updates = {
          id: uuidv4(),
          user_id: user.value.id,
          metric_id: data.id,
          metric_value: metric.valorization,
          date: new Date(),
        };

        const { error: insertError } = await supabase
          .from('health_metrics')
          .insert(updates, {
            returning: 'minimal',
          });

        if (insertError) throw insertError;
      }
    }

    pdfStatusMessage.value = 'PDF data successfully registered.';
  } catch (e) {
    pdfStatusMessage.value = 'An error occurred: ' + e.message;
  } finally {
    pdfIsLoading.value = false;
  }
}

async function fetchMetrics() {
  const { data, error: metricQueryError } = await supabase
      .from('metric_names')
      .select('id, name')

  if (metricQueryError) throw metricQueryError

  metrics.value = data.map(metric => ({
    id: metric.id,
    name: metric.name,
    valorization: null,
  }));
}

fetchMetrics()

async function pushHealthData() {
  isLoading.value = true

  try {
    for (let metric of metrics.value) {
      const updates = {
        id: uuidv4(),
        user_id: user.value.id,
        metric_id: metric.id,
        metric_value: metric.valorization,
        date: new Date(),
      }

      const { error: insertError } = await supabase
        .from('health_metrics')
        .insert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })

      if (insertError) console.log(insertError);
    }

    statusMessage.value = 'Data successfully registered.';
  } catch (e) {
    statusMessage.value = 'An error occurred: ' + e.message;
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <div class="w-full mt-[50px] pb-[50px] 2xl:mt-0 2xl:pb-0">
    <div class="max-w-7xl mx-auto flex flex-col justify-between">
      <h1 class="description font-semibold text-3xl text-left mb-4 dark:text-white">How do you feel today?</h1>
      <div class="flex flex-col">
        <label for="pdfUpload" class="dark:text-white">Upload your lab results file</label>
        <input type="file" id="pdfUpload" ref="pdfUploadRef" class="rounded-md border px-4 py-2 mt-2 mb-3 dark:bg-[#202020] dark:border-[#282828] dark:text-white file:bg-white file:border-solid file:border-[#e5e7eb] dark:file:bg-[#282828] dark:file:border-solid dark:file:border-[#383838] dark:file:text-white p-0 file:px-4 file:py-2 file:mr-4 file:border-r file:shadow-none" />
      </div>
      <div class="flex flex-col justify-end items-end">
        <button type="button" @click="handlePDFUpload" class="button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3">{{ pdfIsLoading ? 'Uploading PDF...' : 'Upload PDF' }}</button>
        <div class="dark:text-white mt-2">{{ pdfStatusMessage }}</div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto text-center mt-4 mb-8">
      <p class="text-[#999]">...or enter your health data manually</p>
    </div>

    <form class="form-widget max-w-7xl mx-auto" @submit.prevent="pushHealthData">
      <div class="grid xl:grid-cols-4 lg:grid-cols-2 lg:gap-4 lg:gap-y-0">
        <div v-for="metric in metrics" :key="metric.id" class="flex flex-col">
          <label :for="metric" class="dark:text-white">{{ metric.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }}</label>
          <input class="inputField rounded-md border px-4 py-2 mt-2 mb-3 dark:bg-[#202020] dark:border-[#282828] dark:text-white" :id="metric" type="text" v-model="metric.valorization" />
        </div>
      </div>

      <div class="flex flex-col justify-end items-end">
        <input
          type="submit"
          :class="`button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3`"
          :value="isLoading ? 'Saving data...' : 'Register health data'"
          :disabled="isLoading"
        />
        <div class="dark:text-white mt-2">{{ statusMessage }}</div>
      </div>
    </form>
  </div>
</template>