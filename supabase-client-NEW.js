// ============================================
// ARCHIVO DE CONFIGURACIÓN ACTUALIZADO PARA SUPABASE CLIENT
// ============================================
// Este archivo reemplaza el supabase-client.js actual después de recrear Supabase

const SUPABASE_CONFIG = {
    // Nueva URL de Kong (API Gateway)
    url: 'https://rsvp.boutique-rsvp.com',

    // Nueva Anon Key (generada con las nuevas credenciales)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdXRpcXVlLXJzdnAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczODA2MTYwMCwiZXhwIjoyMDUzNjM3NjAwfQ.cY4mT8pV2nL6wQ9sR1xK5jH3fG7dA0zB4yC6vE8uI2oP',

    // Opciones de cliente
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        global: {
            headers: {
                'X-Client-Info': 'rsvp-app@1.0.0'
            }
        }
    }
};

// Crear cliente de Supabase
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    SUPABASE_CONFIG.options
);

// Exportar para uso global
window.supabaseClient = supabase;

// Función de diagnóstico
async function testSupabaseConnection() {
    try {
        console.log('🔍 Probando conexión a Supabase...');
        console.log('URL:', SUPABASE_CONFIG.url);

        // Test básico de conexión
        const { data, error } = await supabase.from('guests').select('count');

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

console.log('✅ Supabase Client configurado correctamente');
