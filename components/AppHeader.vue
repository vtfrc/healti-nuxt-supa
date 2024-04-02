<script setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.value = colorMode.preference
}

//const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'ph:sun-fill' : 'ph:moon-fill')

const signup = async () => {
  navigateTo('/')
}

const login = async () => {
  navigateTo('/login')
}

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
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
        <button @click="dashboard">
          <h1 class="font-bold text-3xl text-[#64dfac]">healti</h1>
        </button>
      </div>
      <div class="flex items-center lg:hidden">
        <!-- Hamburger Icon -->
        <button @click="toggleMenu">
          <Icon name="ph:list" />
        </button>
      </div>
      <div class="hidden lg:flex items-center" :class="{'flex': isMenuOpen, 'hidden': !isMenuOpen}">
        <!-- Menu Items -->
        <button @click="toggleDark" class="transition-all duration-500 ease-in-out">
          <Icon v-if="$colorMode.preference === 'dark'" name="ph:sun-fill" />
          <Icon v-if="$colorMode.preference === 'light' || $colorMode.preference === 'system'" name="ph:moon-fill" />
        </button>
        <button v-if="!user" @click="login" class="button ml-4">
          Log in
        </button>
        <button v-if="!user" @click="signup" class="button ml-4 text-[#64dfac] font-bold">
          Sign up
        </button>
        <button v-if="user" @click="account" class="button ml-4">
          Account
        </button>
        <button v-if="user" @click="logout" class="u-text-white ml-4">
          Log out
        </button>
      </div>
    </div>
  </div>
</template>
