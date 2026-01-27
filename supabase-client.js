/**
 * Cliente Supabase - Configuración Centralizada
 * IMPORTANTE: Asegúrate de cargar config.js ANTES que este archivo
 */

(function () {
    // Verificar que config.js se haya cargado
    if (!window.SUPABASE_CONFIG) {
        console.error('❌ CRÍTICO: config.js no está cargado. Carga config.js antes que supabase-client.js');
        return;
    }

    const SUPABASE_URL = window.SUPABASE_CONFIG.SUPABASE_URL;
    const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG.SUPABASE_ANON_KEY;

    console.log('🔧 Inicializando Supabase Client...');
    console.log(`📡 URL: ${SUPABASE_URL}`);
    console.log(`🔑 Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);

    // 1. Detectar la librería (que el CDN carga en window.supabase)
    const lib = window.supabase;
    let client = null;

    try {
        if (lib && lib.createClient) {
            // Estándar CDN v2
            console.log('✅ Detectada librería Supabase en window.supabase');
            client = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else if (typeof createClient !== 'undefined') {
            // Caso raro donde createClient es global
            console.log('✅ Detectado createClient global');
            client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            throw new Error('Librería @supabase/supabase-js no encontrada. Verifica el script CDN en el HTML.');
        }

        // 2. Exponer el CLIENTE como 'window.supabase'
        if (client) {
            window.supabase = client;
            console.log('✅ Cliente Supabase inicializado correctamente');
            console.log(`🌍 Ambiente: ${window.SUPABASE_CONFIG.ENVIRONMENT}`);
        }
    } catch (err) {
        console.error('❌ Error fatal al inicializar Supabase:', err);
        window.supabase = null;
    }
})();

// Helper para verificar conexión (accesible globalmente)
window.checkConnection = async function () {
    if (!window.supabase) {
        console.error('❌ Cliente Supabase no inicializado');
        return false;
    }

    try {
        console.log('🔍 Probando conexión a Supabase...');
        const { data, error } = await window.supabase
            .from('projects')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Error en la consulta:', error);
            throw error;
        }

        console.log('✅ Conexión exitosa!');
        return true;
    } catch (e) {
        console.error('❌ Prueba de conexión falló:', e.message);
        console.error('Detalles:', e);
        return false;
    }
};

// Auto-test de conexión (opcional, comentar si no se desea)
window.addEventListener('load', () => {
    setTimeout(() => {
        window.checkConnection();
    }, 1000);
});
