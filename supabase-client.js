// ============================================
// SUPABASE CLIENT - CONFIGURACIÓN VERIFICADA
// ============================================
// URL verificada con test-supabase-urls.html el 2026-01-28

// IMPORTANTE: Guardar referencia a la librería ANTES de sobrescribirla
const SupabaseLib = window.supabase;

const SUPABASE_CONFIG = {
    // ✅ URL VERIFICADA - Kong Gateway (probado y funcionando)
    // Test results: SUCCESS (200), 531ms response time, 1 project found
    url: 'https://rsvp.boutique-rsvp.com',

    // Anon Key generada por Dockploy
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk1NDY2MzIsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.4aBcS7MkWVZSZDHk2pnH1W3S2hjX02YxPqAxCoISoxE',

    // Opciones de cliente
    options: {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk1NDY2MzIsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.4aBcS7MkWVZSZDHk2pnH1W3S2hjX02YxPqAxCoISoxE',
                'X-Client-Info': 'rsvp-app@1.0.0'
            }
        }
    }
};

// Crear cliente de Supabase usando la librería guardada
const supabaseClient = SupabaseLib.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    SUPABASE_CONFIG.options
);

// Exportar para uso global (ambas variables para compatibilidad)
window.supabaseClient = supabaseClient;
window.supabase = supabaseClient; // Para compatibilidad con dashboard.html

// Función de diagnóstico
async function testSupabaseConnection() {
    try {
        console.log('🔍 Probando conexión a Supabase...');
        console.log('URL:', SUPABASE_CONFIG.url);

        // Test básico de conexión
        const { data, error } = await supabaseClient.from('guests').select('count');

        if (error) {
            console.error('❌ Error de conexión:', error);
            return false;
        }

        console.log('✅ Conexión exitosa a Supabase');
        return true;
    } catch (err) {
        console.error('❌ Error crítico:', err);
        return false;
    }
}

// Auto-test al cargar (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    testSupabaseConnection();
}

console.log('✅ Supabase Client configurado con credenciales de Dockploy');
console.log('📡 Disponible como window.supabase y window.supabaseClient');
