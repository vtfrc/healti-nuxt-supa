<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleSignUp = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signUp({ email: email.value, password: password.value })
    if (error) throw error
    else navigateTo('/')
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}

const login = async () => {
    navigateTo('/')
}
</script>

<template>
  <form class="form-widget flex flex-col max-w-[500px] w-full" @submit.prevent="handleSignUp">
      <h1 class="description font-semibold text-3xl text-center mb-4 dark:text-white">Sign up for Healti.</h1>
      <div class="flex flex-col w-full">
        <input class="inputField rounded-md border px-4 py-2 mt-2 w-full dark:bg-[#202020] dark:border-[#282828] dark:text-white" type="email" placeholder="Your email" v-model="email" />
        <input class="inputField rounded-md border px-4 py-2 mt-2 w-full dark:bg-[#202020] dark:border-[#282828] dark:text-white" type="password" placeholder="Your password" v-model="password" />
      </div>
      <div class="text-center md:text-left md:flex md:justify-between">
        <button
          type="button"
          variant="transparent"
          @click="login"
        >
          <p class="mt-3 text-[#87AA9E]">Already have an account? Log in</p>
        </button>
        <input
          type="submit"
          class="button bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3 md:float-right"
          :value="loading ? 'Loading' : 'Sign up'"
          :disabled="loading"
        />
      </div>
  </form>
</template>
