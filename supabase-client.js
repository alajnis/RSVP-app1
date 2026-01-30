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

// Sync Initialization
(function initSupabase() {
    // Check if Supabase library is loaded (should be there if script is blocking)
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        init(window.supabase);
    } else {
        console.warn('⚠️ Supabase lib not ready immediately. Waiting...');
        // Fallback for async loading scenarios
        let attempts = 0;
        const interval = setInterval(() => {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                clearInterval(interval);
                init(window.supabase);
            } else if (attempts > 50) { // 5 seconds max
                clearInterval(interval);
                console.error('❌ CRITICAL: Supabase library failed to load');
                // Show error on UI if possible
                if (document.body) {
                    const errDiv = document.createElement('div');
                    errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:10px;z-index:9999;text-align:center;';
                    errDiv.textContent = 'Error crítico: No se pudo cargar la librería Supabase. Recargue la página.';
                    document.body.appendChild(errDiv);
                }
            }
            attempts++;
        }, 100);
    }

    function init(SupabaseLib) {
        try {
            // Create Client
            const supabaseClient = SupabaseLib.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                SUPABASE_CONFIG.options
            );

            // Export globally
            window.supabaseClient = supabaseClient;
            window.supabase = supabaseClient; // Overwrite library with client instance

            console.log('✅ Supabase Client initialized globally');
        } catch (e) {
            console.error('❌ Error initializing Supabase client:', e);
        }
    }
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
