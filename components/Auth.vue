<script setup>
const { auth } = useSupabaseAuthClient()

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true

  try {
    const { error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMsg.value = 'Invalid email or password.'
      console.log(error);
      return;
    }

    await navigateTo('/dashboard');
  } catch (error) {
    errorMsg.value = 'An unexpected error occurred.'
    console.log(error);
  } finally {
    isLoading.value = false
  }
}

const signup = async () => {
  await navigateTo('/signup')
}
</script>

<template>
  <form class="form-widget flex flex-col max-w-[500px] w-full" @submit.prevent="handleLogin">
      <h1 class="description font-semibold text-3xl text-center mb-4 dark:text-white">A new way of being Healti.</h1>
      <div class="rounded-md mb-2 border bg-[#f5b8b8] border-[#b56262] dark:bg-[#692b2b] dark:border-[#a84545]" v-if="errorMsg">
        <p class="text-center dark:text-white">{{ errorMsg }}</p>
      </div>
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
          :class="`button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3 md:float-right`"
          :value="isLoading ? 'Logging in...' : 'Log in'"
          :disabled="isLoading"
        />
      </div>
  </form>
</template>