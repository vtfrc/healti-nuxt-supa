<script setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

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
        <UButton
          variant="transparent"
          @click="dashboard"
        >
          <h1 class="text-[#64CFAC] font-extrabold text-3xl">h</h1>
        </UButton>
      </div>
      <div class="flex items-center">
        <UButton
            v-if="user"
            class="button"
            variant="transparent"
            @click="account"
        >
            Account
        </UButton>
        <UButton
          variant="transparent"
          class="u-text-white ml-4"
          @click="toggleDark"
        >
          {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }}
        </UButton>
        <UButton
          v-if="user"
          class="u-text-white ml-4"
          variant="transparent"
          @click="logout"
        >
          Log out
        </UButton>
      </div>
    </div>
  </div>
</template>