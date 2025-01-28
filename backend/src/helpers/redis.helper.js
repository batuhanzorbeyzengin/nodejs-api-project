const Redis = require('ioredis');
const config = require('../config');
const logger = require('./logger.helper');

class RedisHelper {
    constructor() {
        this.createClient();
    }

    createClient() {
        this.client = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                logger.info(`Retrying Redis connection in ${delay}ms... (Attempt ${times})`);
                return delay;
            },
            maxRetriesPerRequest: 3
        });

        this.client.on('error', (error) => {
            logger.error('Redis connection error:', {
                error: error.message,
                host: config.redis.host,
                port: config.redis.port
            });
        });

        this.client.on('connect', () => {
            logger.info('Redis connected successfully', {
                host: config.redis.host,
                port: config.redis.port
            });
        });

        this.client.on('reconnecting', () => {
            logger.info('Redis reconnecting...');
        });
    }

    async get(key) {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error('Redis get error:', { key, error: error.message });
            return null;
        }
    }

    async set(key, value, ttl = config.cache.ttl) {
        try {
            await this.client.set(
                key,
                JSON.stringify(value),
                'EX',
                ttl
            );
            return true;
        } catch (error) {
            logger.error('Redis set error:', { key, error: error.message });
            return false;
        }
    }

    async del(key) {
        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            logger.error('Redis delete error:', { key, error: error.message });
            return false;
        }
    }

    generateKey(prefix, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc, key) => {
                acc[key] = params[key];
                return acc;
            }, {});

        return `${prefix}:${JSON.stringify(sortedParams)}`;
    }
}

module.exports = new RedisHelper(); 