<script setup>
import { v4 as uuidv4 } from "uuid";

import ocrService from '~/services/ocr';
import nlpService from '~/services/nlp';

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const pdfUploadRef = ref(null);

const metrics = ref([]);

const metricName = ref([]);
const metricValue = ref([]);

const pdfStatusMessage = ref('');
const statusMessage = ref('');
const pdfIsLoading = ref(false);
const isLoading = ref(false);

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
  .from('health_metrics')
  .select(`
    id,
    date,
    metric_id,
    metric_value,
    metric_names (
      name
    )
  `);

  if (metricQueryError) throw metricQueryError

  metrics.value = data.map(metric => ({
    id: metric.id,
    name: metric.metric_names.name,
    value: metric.metric_value,
    date: metric.date,
  }));
}

fetchMetrics()

async function pushHealthData() {
  isLoading.value = true;

  try {
    const { data, error: queryError } = await supabase
      .from('metric_names')
      .select('id')
      .eq('name', metricName.value)
      .single();

    if (queryError) throw queryError;

    const updates = {
      id: uuidv4(),
      user_id: user.value.id,
      metric_id: data.id,
      metric_value: metricValue.value,
      date: new Date(),
    };

    const { error: insertError } = await supabase
      .from('health_metrics')
      .insert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

    if (insertError) throw insertError;

    statusMessage.value = 'Data successfully registered.';
    metricName.value = ''; // Reset the metric name input field
    metricValue.value = ''; // Reset the metric value input field

  } catch (e) {
    statusMessage.value = 'An error occurred: ' + e.message;
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div class="w-full mt-[50px] pb-[50px] 2xl:mt-0 2xl:pb-0">
    <div class="max-w-7xl mx-auto flex flex-col justify-between">
      <h1 class="description font-semibold text-3xl text-left mb-4 dark:text-white">How do you feel today?</h1>
      <div class="flex flex-col">
        <label for="pdfUpload" class="dark:text-white">Upload your lab results file</label>
        <input type="file" id="pdfUpload" ref="pdfUploadRef" class="cursor-pointer rounded-md mt-2 mb-3 bg-[#eee] dark:bg-[#222] dark:text-white file:cursor-pointer file:bg-[#64CFAC] file:text-white file:rounded-md file:border-solid file:border-0 p-0 file:px-4 file:py-2 file:mr-4 file:shadow-none" />
      </div>
      <div class="flex flex-col justify-end items-end">
        <button type="button" @click="handlePDFUpload" class="button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3">{{ pdfIsLoading ? 'Uploading PDF...' : 'Upload PDF' }}</button>
        <div class="dark:text-white mt-2">{{ pdfStatusMessage }}</div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto text-center mt-4 mb-8">
      <p class="text-[#888]">...or enter your health data manually</p>
    </div>

    <form class="form-widget max-w-7xl mx-auto" @submit.prevent="pushHealthData">
      <div class="grid lg:grid-cols-2 lg:flex-row lg:gap-4">
        <div class="flex flex-col mb-3 lg:mb-0">
          <input id="metricName" type="text" v-model="metricName" class="inputField rounded-md px-4 py-2 mt-2 bg-[#eee] dark:bg-[#222] dark:text-white" placeholder="Health metric name" />
        </div>
        <div class="flex flex-col">
          <input id="metricValue" type="text" v-model="metricValue" class="inputField rounded-md px-4 py-2 mt-2 bg-[#eee] dark:bg-[#222] dark:text-white" placeholder="Measured value" />
        </div>
      </div>

      <div class="flex flex-col justify-end items-end mt-3">
        <input type="submit" class="button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md" :value="isLoading ? 'Saving data...' : 'Register health data'" :disabled="isLoading" />
        <div class="dark:text-white mt-2">{{ statusMessage }}</div>
      </div>
    </form>
  </div>
</template>