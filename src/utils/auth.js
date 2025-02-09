export function checkAuth(router) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        router.push('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    }
    return user;
}
