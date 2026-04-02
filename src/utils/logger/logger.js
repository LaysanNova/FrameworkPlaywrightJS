import pino from 'pino';

const env = process.env.ENV || 'development';
const isDev = env === 'development';

const logger = pino(
    isDev
        ? {
            level: 'debug',
            base: { service: 'ui-tests', env },
            timestamp: pino.stdTimeFunctions.isoTime,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            },
        }
        : {
            level: 'info',
            base: { service: 'ui-tests', env },
            timestamp: pino.stdTimeFunctions.isoTime,
        }
);

export default logger;
