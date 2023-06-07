import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

function formatter(isConsole: boolean) {
    const formatters = [];

    formatters.push(
        winston.format((info) => {
            info.level = info.level.toUpperCase();
            return info;
        })()
    );

    if (isConsole) formatters.push(winston.format.colorize({ level: true }));

    formatters.push(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
    );

    return winston.format.combine(...formatters);
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.join(process.env.LOGS_DIR, 'pc-manager-%DATE%.log'),
            format: formatter(false),
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: formatter(true),
    })
);

export default logger;
