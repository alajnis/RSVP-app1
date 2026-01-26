
// Configuración de Supabase para VPS Dokploy
const SUPABASE_URL = 'https://rsvp.boutique-rsvp.com';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk0Mjg4MDgsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.6kZJm1OcvT6b5uNAHcSOxp9GzXhKMdJZc6gXyojx2Q4';

(function () {
    // 1. Detectar la librería (que el CDN carga en window.supabase)
    const lib = window.supabase;

    let client = null;

    if (lib && lib.createClient) {
        // Estándar CDN v2
        console.log('Detectada librería Supabase en window.supabase');
        client = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (typeof createClient !== 'undefined') {
        // Caso raro donde createClient es global
        console.log('Detectado createClient global');
        client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('CRÍTICO: No se encontró la librería @supabase/supabase-js. Verifica el script CDN en el HTML.');
        return;
    }

    // 2. Exponer el CLIENTE como 'window.supabase'
    // Esto es necesario porque el resto de la app espera usar 'supabase.from()'
    // y actualmente 'supabase' es la librería (que no tiene .from)
    if (client) {
        window.supabase = client;
        console.log('Cliente Supabase inicializado y asignado a window.supabase. Conectado a:', SUPABASE_URL);
    }
})();

// Helper para verificar conexión (accesible globalmente)
window.checkConnection = async function () {
    try {
        const { data, error } = await window.supabase.from('projects').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('Prueba de conexión exitosa!');
        return true;
    } catch (e) {
        console.error('Prueba de conexión falló:', e.message);
        return false;
    }
};
