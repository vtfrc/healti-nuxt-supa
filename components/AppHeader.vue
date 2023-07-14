<script setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

//const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'ph:sun-fill' : 'ph:moon-fill')

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}

const dashboard = async () => {
  navigateTo('/dashboard')
}

const account = async () => {
    navigateTo('/account')
}
</script>

<template>
  <div>
    <Title>Healti</Title>
    <div class="flex items-center justify-between px-4 py-1 border-b dark:border-[#282828] dark:text-white">
      <div class="block">
        <button
          variant="transparent"
          @click="dashboard"
        >
          <h1 class="font-bold text-3xl text-[#64dfac]">healti</h1>
        </button>
      </div>
      <div class="flex items-center">
        <button
          variant="transparent"
          class="flex u-text-white transition-all duration-500 ease-in-out"
          @click="toggleDark"
        > 

          <Icon v-if="colorMode.value === 'light'" name="ph:sun-fill" />

          <Icon v-if="colorMode.value === 'dark'" name="ph:moon-fill" />
        </button>
        <button
            v-if="user"
            class="button ml-4"
            variant="transparent"
            @click="account"
        >
            Account
        </button>
        <button
          v-if="user"
          class="u-text-white ml-4"
          variant="transparent"
          @click="logout"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
</template>