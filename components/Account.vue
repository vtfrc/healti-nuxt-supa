<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')

async function updateUserData() {
  const updates = {
    email: email.value,
    password: password.value,
  }

  const { user, error } = await supabase.auth.updateUser(updates, {
    returning: 'minimal', // Don't return the value after inserting
  })

  console.log(user)
  console.log(error)

  alert('User data updated successfully.')
}

async function signOut() {
  let { user, error } = await supabase.auth.signOut()
  console.log(user)
  console.log(error)
  navigateTo('/')
}
</script>

<template>
  <form class="form-widget max-w-[500px] w-full" @submit.prevent="updateUserData">
    <h1 class="description font-semibold text-3xl text-left mb-4 dark:text-white">Edit your profile credentials</h1>
    <div class="flex flex-col">
      <label for="email" class="dark:text-white">Email</label>
      <input class="inputField rounded-md border px-4 py-2 mt-2 mb-3 dark:bg-[#202020] dark:border-[#282828] dark:text-white" id="email" type="email" :value="user?.email" />
    </div>
    <div class="flex flex-col">
      <label for="password" class="dark:text-white">Password</label>
      <input class="inputField rounded-md border px-4 py-2 mt-2 dark:bg-[#202020] dark:border-[#282828] dark:text-white" id="password" type="password" v-model="password" />
    </div>

    <div class="flex mt-2 float-right">
      <input
        type="submit"
        class="button cursor-pointer bg-[#64CFAC] text-white px-4 py-2 rounded-md mt-3"
        value="Update"
      />

      <button class="button bg-white text-[#64CFAC] border px-4 py-2 rounded-md mt-3 ml-2 dark:bg-[#202020] dark:border-[#282828]" @click="signOut" type="button">Log out</button>
    </div>
  </form>
</template>