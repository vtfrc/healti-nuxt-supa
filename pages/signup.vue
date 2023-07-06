<script setup>
const user = useSupabaseUser()

if (user.value) {
    navigateTo('/dashboard')
}  

</script>

<template>
    <Signup />
</template>