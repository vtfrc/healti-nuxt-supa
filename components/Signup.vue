<script setup>
const { auth } = useSupabaseAuthClient()

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const showPasswordField = ref(false);

const handleSignUp = async () => {
  successMsg.value = ''
  errorMsg.value = ''

  if (!showPasswordField.value) {
    try {
      if (!email.value) throw new Error('Please enter your email.')
      showPasswordField.value = true;
    } catch (error) {
      errorMsg.value = error.message
    }
    return;
  }

  try {
    isLoading.value = true
    const { data, error } = await auth.signUp({
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
    await navigateTo('/login')
}
</script>

<template>
  <form class="form-widget flex flex-col items-center max-w-[750px] w-full" @submit.prevent="handleSignUp">
      <h1 class="description font-semibold text-4xl lg:text-6xl text-center mb-4 dark:text-white">The modern <span class="text-[#64CFAC]">personal health record</span></h1>
      <p class="dark:text-white text-center mt-4 mb-6 text-lg">Scan and keep your health-related data all in one place</p>
      <div class="max-w-[500px] w-full">
        <div class="rounded-md mb-2 border bg-[#f5b8b8] border-[#b56262] dark:bg-[#692b2b] dark:border-[#a84545]" v-if="errorMsg">
          <p class="text-center dark:text-white">{{ errorMsg }}</p>
        </div>
        <div class="rounded-md mb-2 border bg-[#b8f5c4] border-[#62b562] dark:bg-[#2b6952] dark:border-[#45a845]" v-if="successMsg">
          <p class="text-center dark:text-white">{{ successMsg }}</p>
        </div>
        <div class="flex flex-col w-full">
          <input class="inputField rounded-md px-4 py-2 mt-2 w-full bg-[#eee] dark:bg-[#222] dark:text-white" type="email" placeholder="Your email" v-model="email" />
          <input v-if="showPasswordField" class="inputField rounded-md px-4 py-2 mt-2 w-full bg-[#eee] dark:bg-[#222] dark:text-white" type="password" placeholder="Your password" v-model="password" />
        </div>
        <div class="text-center md:text-left flex flex-col-reverse">
          <input
            type="submit"
            :class="`button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3`"
            :value="showPasswordField ? (isLoading ? 'Signing you up...' : 'Complete your registration →') : 'Track your health data now →'"
            :disabled="isLoading"
          />
        </div>
      </div>
  </form>
</template>
