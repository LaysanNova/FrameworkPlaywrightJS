import logger from './logger';

class LoggerReporter {
    constructor() {
        this.testTimes = new Map();
    }

    onTestBegin(test) {
        this.testTimes.set(test.id, Date.now());

        logger.info({
            est: test.title
        }, `START: ${test.title}`);
    }

    onTestEnd(test, result) {
        const start = this.testTimes.get(test.id);
        const duration = Date.now() - start;

        logger.info({
            test: test.title,
            status: result.status,
            duration: `${duration}ms`,
            error: result.error?.message
        }, `END ${test.title}`);

        this.testTimes.delete(test.id);
    }
}

export default LoggerReporter;