
const crypto = require('crypto');

// 1. Generate Plain Alphanumeric Secret (40 chars)
const secret = crypto.randomBytes(30).toString('hex').slice(0, 40);

function base64url(source) {
    let encodedSource = Buffer.from(source).toString('base64');
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
}

function sign(payload, secret) {
    const header = { "alg": "HS256", "typ": "JWT" };
    const encodedHeader = base64url(JSON.stringify(header));
    const encodedData = base64url(JSON.stringify(payload));
    const token = `${encodedHeader}.${encodedData}`;

    const signature = crypto.createHmac('sha256', secret).update(token).digest('base64');
    const encodedSignature = signature.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

    return `${token}.${encodedSignature}`;
}

const iat = Math.floor(Date.now() / 1000) - 60;
const exp = iat + (20 * 365 * 24 * 60 * 60); // 20 years

const anonToken = sign({
    "role": "anon",
    "iss": "supabase",
    "iat": iat,
    "exp": exp
}, secret);

const serviceToken = sign({
    "role": "service_role",
    "iss": "supabase",
    "iat": iat,
    "exp": exp
}, secret);

console.log('JWT_SECRET=' + secret);
console.log('ANON_KEY=' + anonToken);
console.log('SERVICE_KEY=' + serviceToken);
