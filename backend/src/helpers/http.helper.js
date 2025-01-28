const axios = require('axios');
const config = require('../config');
const logger = require('./logger.helper');

class HttpClient {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL: baseURL || config.apiBaseUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    setAuthToken(token) {
        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    async get(url, config = {}) {
        try {
            const response = await this.client.get(url, {
                ...config,
                headers: {
                    ...this.client.defaults.headers,
                    ...config.headers
                }
            });
            return response.data;
        } catch (error) {
            logger.error('GET request failed', { url, error: error.message });
            throw error;
        }
    }

    async post(url, data = {}, config = {}) {
        try {
            const response = await this.client.post(url, data, {
                ...config,
                headers: {
                    ...this.client.defaults.headers,
                    ...config.headers
                }
            });
            return response.data;
        } catch (error) {
            logger.error('POST request failed', { url, error: error.message });
            throw error;
        }
    }
}

module.exports = new HttpClient(); 