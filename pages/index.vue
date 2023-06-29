<script setup>
const user = useSupabaseUser()
const { auth } = useSupabaseAuthClient()

if (user.value) {
    navigateTo('/dashboard')
}  

</script>

<template>
    <Auth />
</template>