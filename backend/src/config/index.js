require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.point.nexus/v1',
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour in seconds
        productDetailTtl: parseInt(process.env.PRODUCT_DETAIL_CACHE_TTL) || 900 // 15 minutes in seconds
    },
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
        methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: process.env.CORS_ALLOWED_HEADERS ? process.env.CORS_ALLOWED_HEADERS.split(',') : ['Content-Type', 'Authorization'],
        exposedHeaders: process.env.CORS_EXPOSED_HEADERS ? process.env.CORS_EXPOSED_HEADERS.split(',') : ['Content-Range', 'X-Content-Range'],
        credentials: process.env.CORS_CREDENTIALS === 'true',
        maxAge: parseInt(process.env.CORS_MAX_AGE) || 86400 // 24 hours in seconds
    },
    helmet: {
        // XSS koruması
        xssFilter: true,
        
        // MIME type sniffing koruması
        noSniff: true,
        
        // X-Powered-By header'ı gizle
        hidePoweredBy: true,
        
        // DNS prefetch kontrolü
        dnsPrefetchControl: {
            allow: false
        },
        
        // Clickjacking koruması
        frameguard: {
            action: 'deny'
        },
        
        // HTTP Strict Transport Security
        hsts: {
            maxAge: 31536000, // 1 yıl
            includeSubDomains: true,
            preload: true
        },
        
        // Content Security Policy
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'none'"],
                connectSrc: ["'self'"],
                frameAncestors: ["'none'"]
            }
        },
        
        // Cross-Origin Resource Policy
        crossOriginResourcePolicy: { 
            policy: "same-site" 
        },
        
        // Referrer Policy
        referrerPolicy: {
            policy: 'no-referrer'
        }
    }
};
