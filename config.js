/**
 * RSVP App - Configuración Central de Supabase
 * 
 * INSTRUCCIONES:
 * 1. Para desarrollo LOCAL: Usa CONFIG_LOCAL
 * 2. Para producción REMOTA: Usa CONFIG_PRODUCTION
 * 
 * Cambia la línea 28 según tu ambiente
 */

// ============= CONFIGURACIÓN LOCAL =============
const CONFIG_LOCAL = {
    SUPABASE_URL: 'http://localhost:8000',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY5NDU4MDYzLCJleHAiOjIwODQ4MTgwNjN9.BLdRie7if_hl-k0kPoe6JsZuw6C-emTGLfbIqzaV6VI',
    ENVIRONMENT: 'local'
};

// ============= CONFIGURACIÓN PRODUCCIÓN =============
const CONFIG_PRODUCTION = {
    // VPS Dokploy - IP: 76.13.166.122
    // Usando IP directa por ahora (el DNS no está validado aún)
    SUPABASE_URL: 'http://76.13.166.122:8000',

    // Cuando el dominio boutique-rsvp.com esté listo, descomenta esta línea:
    // SUPABASE_URL: 'http://boutique-rsvp.com:8000',
    // (O con HTTPS si tienes SSL: 'https://boutique-rsvp.com')

    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY5NDU4MDYzLCJleHAiOjIwODQ4MTgwNjN9.BLdRie7if_hl-k0kPoe6JsZuw6C-emTGLfbIqzaV6VI',
    ENVIRONMENT: 'production'
};

// ============= CONFIGURACIÓN ACTIVA =============
// 🔧 CAMBIA AQUÍ: CONFIG_LOCAL o CONFIG_PRODUCTION
const SUPABASE_CONFIG = CONFIG_PRODUCTION;

// ============= EXPORTAR CONFIGURACIÓN =============
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
console.log(`🚀 Supabase configurado para: ${SUPABASE_CONFIG.ENVIRONMENT}`);
console.log(`📡 URL: ${SUPABASE_CONFIG.SUPABASE_URL}`);
