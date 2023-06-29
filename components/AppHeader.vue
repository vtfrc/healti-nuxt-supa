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
    <div class="flex items-center md:justify-between justify-center px-4 py-2 bg-[#D0FFF0] text-[#64CFAC]">
      <div class="hidden md:block">
        <UButton
          variant="transparent"
          @click="dashboard"
        >
          <img src="/logo.png" alt="logo" class="w-10 h-10" />
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
          class="u-text-white ml-3"
          @click="toggleDark"
        >
          Dark/Light
        </UButton>
        <UButton
          v-if="user"
          class="u-text-white ml-3"
          variant="transparent"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>