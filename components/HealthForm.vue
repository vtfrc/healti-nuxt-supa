<script setup>
import { v4 as uuidv4 } from "uuid";

const supabase = useSupabaseClient()

const loading = ref(false)

async function pushHealthData() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const metrics = [
      { name: 'blood_pressure', value: blood_pressure.value },
      { name: 'heart_rate', value: heart_rate.value },
      { name: 'blood_oxygen', value: blood_oxygen.value },
      { name: 'temperature', value: temperature.value },
    ]

    for (let metric of metrics) {

      const { data, queryError } = await supabase
      .from('metric_names')
      .select('id')
      .eq('name', metric.name)
      .single()

      if (queryError) throw queryError

      const updates = {
        id: uuidv4(),
        user_id: user.value.id,
        metric_id: data.id,
        metric_value: metric.value,
        date: new Date(),
      }

      const { error: insertError } = await supabase
        .from('health_metrics')
        .insert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })

      if (insertError) throw insertError
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <form class="form-widget max-w-800px w-full" @submit.prevent="pushHealthData">
    <h1 class="description font-semibold text-xl text-left mb-4 dark:text-white">How is your health today?</h1>
    <div class="flex flex-col">
      <label for="blood_pressure" class="dark:text-white">Blood Pressure</label>
      <input class="inputField rounded-md border px-4 py-2 mt-2 mb-3 dark:bg-[#202020] dark:border-[#282828] dark:text-white" id="blood_pressure" type="text" v-model="blood_pressure" />
    </div>
    <div class="flex flex-col">
      <label for="heart_rate" class="dark:text-white">Heart Rate</label>
      <input class="inputField rounded-md border px-4 py-2 mt-2 mb-3 dark:bg-[#202020] dark:border-[#282828] dark:text-white" id="heart_rate" type="text" v-model="heart_rate" />
    </div>
    <div class="flex flex-col">
      <label for="blood_oxygen" class="dark:text-white">Blood Oxygen</label>
      <input class="inputField rounded-md border px-4 py-2 mt-2 mb-3 dark:bg-[#202020] dark:border-[#282828] dark:text-white" id="blood_oxygen" type="text" v-model="blood_oxygen" />
    </div>
    <div class="flex flex-col">
      <label for="temperature" class="dark:text-white">Temperature</label>
      <input class="inputField rounded-md border px-4 py-2 mt-2 dark:bg-[#202020] dark:border-[#282828] dark:text-white" id="temperature" type="text" v-model="temperature" />
    </div>

    <div class="flex mt-2 float-right">
      <input
        type="submit"
        class="button bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3"
        :value="loading ? 'Loading ...' : 'Register Health Data'"
        :disabled="loading"
      />

    </div>
  </form>
</template>