var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const redis = require('redis');
const logger = require('./logger');
let redisClient;
/**
 * A Singleton module that provides a single redis client through out
 * the lifetime of the server
 *
 * @param {Record<string, unknown>} [opts] node-redis client options
 */
function createClient(opts) {
    if (!redisClient) {
        // todo remove legacyMode when fixed: https://github.com/tj/connect-redis/issues/361
        redisClient = redis.createClient(Object.assign(Object.assign({}, opts), { legacyMode: true }));
        redisClient.on('error', err => logger.error('redis error', err));
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                // fire and forget.
                // any requests made on the client before connection is established will be auto-queued by node-redis
                yield redisClient.connect();
            }
            catch (err) {
                logger.error(err.message, 'redis.error');
            }
        }))();
    }
    return redisClient;
}
module.exports.client = (companionOptions) => {
    if (!companionOptions) {
        return redisClient;
    }
    return createClient(Object.assign(Object.assign({}, companionOptions.redisOptions), { url: companionOptions.redisUrl }));
};
