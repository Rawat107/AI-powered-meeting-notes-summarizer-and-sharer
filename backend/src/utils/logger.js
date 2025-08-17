import { timeStamp } from 'console';
import fs from 'fs'
import path from 'path'

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../../../logs')
        this.ensureLogDir();
    }

    ensureLogDir(){
        if(!fs.existsSync(this.logsDir)){
            fs.mkdirSync(this.logsDir, {recursive: true})
        }
    }

    formatMessage(level, message, meta = {}){
        return {
            timeStamp: new Date().toISOString(),
            level,
            message,
            ...meta
        }
    }

    writeToFile(level, data){
        const logFile = path.join(this.logsDir, `${level}.log`)
        const logEntry = JSON.stringify(data) + '\n'

        fs.appendFileSync(logFile, logEntry)
    }

    log(level, message, meta = {}){
        const formatMessage = this.formatMessage(level, message, meta)

        const colors = {
            error: '\x1b[31m',
            warn: '\x1b[33m',
            info: '\x1b[36m',
            debug: '\x1b[35m', // Magenta
            reset: '\x1b[0m'   // Reset
        };

        console.log(
        `${colors[level] || colors.info}[${formattedMessage.timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`,
        meta && Object.keys(meta).length ? meta : ''
        );


        // Write to file in production
        if (process.env.NODE_ENV === 'production') {
        this.writeToFile(level, formattedMessage);
        }
    }

     error(message, meta = {}) {
        this.log('error', message, meta);
    }

    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
        this.log('debug', message, meta);
        }
    }

}

export default new Logger();