<script setup>
const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const handleSignUp = async () => {
  successMsg.value = ''
  errorMsg.value = ''

  try {
    isLoading.value = true
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (data.user && data.user.identities && data.user.identities.length === 0) throw new Error('This email is already taken.')
    if (error) throw error
    successMsg.value = 'Check your email to confirm your account.'
    isLoading.value = false
  } catch (error) {
    errorMsg.value = error.message
    isLoading.value = false
  }
}

const login = async () => {
    await navigateTo('/')
}
</script>

<template>
  <form class="form-widget flex flex-col max-w-[500px] w-full" @submit.prevent="handleSignUp">
      <h1 class="description font-semibold text-3xl text-center mb-4 dark:text-white">Sign up for Healti.</h1>
      <div class="rounded-md mb-2 border bg-[#f5b8b8] border-[#b56262] dark:bg-[#692b2b] dark:border-[#a84545]" v-if="errorMsg">
        <p class="text-center dark:text-white">{{ errorMsg }}</p>
      </div>
      <div class="rounded-md mb-2 border bg-[#b8f5c4] border-[#62b562] dark:bg-[#2b6952] dark:border-[#45a845]" v-if="successMsg">
        <p class="text-center dark:text-white">{{ successMsg }}</p>
      </div>
      <div class="flex flex-col w-full">
        <input class="inputField rounded-md border px-4 py-2 mt-2 w-full dark:bg-[#202020] dark:border-[#282828] dark:text-white" type="email" placeholder="Your email" v-model="email" />
        <input class="inputField rounded-md border px-4 py-2 mt-2 w-full dark:bg-[#202020] dark:border-[#282828] dark:text-white" type="password" placeholder="Your password" v-model="password" />
      </div>
      <div class="text-center md:text-left flex flex-col-reverse md:flex-row md:justify-between">
        <button
          type="button"
          variant="transparent"
          @click="login"
        >
          <p class="mt-3 text-[#87AA9E]">Already have an account? Log in</p>
        </button>
        <input
          type="submit"
          :class="`button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3 md:float-right`"
          :value="isLoading ? 'Signing you up...' : 'Sign up'"
          :disabled="isLoading"
        />
      </div>
  </form>
</template>
