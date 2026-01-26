
// Configuración de Supabase para VPS Dokploy
const SUPABASE_URL = 'http://rsvp-app-supabase-b3cdd1-76-13-166-122.traefik.me';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk0Mjg4MDgsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.6kZJm1OcvT6b5uNAHcSOxp9GzXhKMdJZc6gXyojx2Q4';

// Inicializar cliente globalmente
let supabase;

if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized connected to:', SUPABASE_URL);
} else {
    console.error('Supabase SDK not loaded. Make sure to include the CDN script before this file.');
}

// Helper para verificar conexión
async function checkConnection() {
    try {
        const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('Connection successful!');
        return true;
    } catch (e) {
        console.error('Connection failed:', e.message);
        return false;
    }
}
