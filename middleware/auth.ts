export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser()

    if (!user.value && (to.path === '/dashboard' || to.path === '/account')) {
        return navigateTo('/')
    } else if (user.value && (to.path === '/' || to.path === '/signup')) {
        return navigateTo('/dashboard')
    }
    
})
