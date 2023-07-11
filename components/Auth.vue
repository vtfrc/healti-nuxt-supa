<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (error) throw error
    else navigateTo('/dashboard')
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}

const signup = async () => {
    navigateTo('/signup')
}
</script>

<template>
  <form class="form-widget flex flex-col max-w-[500px] w-full" @submit.prevent="handleLogin">
      <h1 class="description font-semibold text-3xl text-center mb-4 dark:text-white">A new way of being Healti.</h1>
      <div class="flex flex-col w-full">
        <input class="inputField rounded-md border px-4 py-2 mt-2 w-full dark:bg-[#202020] dark:border-[#282828] dark:text-white" type="email" placeholder="Your email" v-model="email" />
        <input class="inputField rounded-md border px-4 py-2 mt-2 w-full dark:bg-[#202020] dark:border-[#282828] dark:text-white" type="password" placeholder="Your password" v-model="password" />
      </div>
      <div class="text-center md:text-left flex flex-col-reverse md:flex-row md:justify-between">
        <button
          type="button"
          variant="transparent"
          @click="signup"
        >
          <p class="mt-3 text-[#87AA9E]">Don't have an account? Sign up</p>
        </button>
        <input
          type="submit"
          class="button bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3 md:float-right"
          :value="loading ? 'Loading' : 'Log in'"
          :disabled="loading"
        />
      </div>
  </form>
</template>