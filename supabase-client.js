// ============================================
// SUPABASE CLIENT - CONFIGURACIÓN VERIFICADA
// ============================================
// URL verificada con test-supabase-urls.html el 2026-01-28

// ============================================
// SUPABASE CLIENT - ASYNC INIT QUEUE
// ============================================

const SUPABASE_CONFIG = {
    url: 'https://rsvp.boutique-rsvp.com',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk1NDY2MzIsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.4aBcS7MkWVZSZDHk2pnH1W3S2hjX02YxPqAxCoISoxE',
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

// Async Initialization Loop
(async function initSupabase() {
    let attempts = 0;
    while (!window.supabase && attempts < 100) { // Wait up to 10 seconds for CDN
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }

    if (!window.supabase) {
        console.error('❌ CRITICAL: Supabase library failed to load from CDN');
        return;
    }

    const SupabaseLib = window.supabase;

    // Create Client
    const supabaseClient = SupabaseLib.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey,
        SUPABASE_CONFIG.options
    );

    // Export globally
    window.supabaseClient = supabaseClient;
    window.supabase = supabaseClient; // For legacy compatibility

    console.log('✅ Supabase Client initialized asynchronously');
})();

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
