<script setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const signup = async () => {
  if (isMenuOpen.value) isMenuOpen.value = false
  navigateTo('/')
}

const login = async () => {
  if (isMenuOpen.value) isMenuOpen.value = false
  navigateTo('/login')
}

const logout = async () => {
  if (isMenuOpen.value) isMenuOpen.value = false
  await client.auth.signOut()
  navigateTo('/login')
}

const dashboard = async () => {
  if (isMenuOpen.value) isMenuOpen.value = false
  navigateTo('/dashboard')
}

const account = async () => {
  if (isMenuOpen.value) isMenuOpen.value = false
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
          <Icon v-if="!isMenuOpen" name="ph:list" />
          <Icon v-if="isMenuOpen" name="ph:x" />
        </button>
      </div>
      <div class="hidden md:flex items-center" :class="{'hidden': isMenuOpen, 'flex': !isMenuOpen}">
        <!-- Menu Items -->
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
  <div class="flex-col items-center border-b dark:border-[#222] flex md:hidden dark:text-white" :class="{'flex': isMenuOpen, 'hidden': !isMenuOpen}">
    <!-- Menu Items -->
    <button v-if="!user" @click="login" class="button mb-2">
      Log in
    </button>
    <button v-if="!user" @click="signup" class="button text-[#64dfac] font-bold mb-2">
      Sign up
    </button>
    <button v-if="user" @click="account" class="button mb-2">
      Account
    </button>
    <button v-if="user" @click="logout" class="u-text-white mb-2">
      Log out
    </button>
  </div>
</template>
