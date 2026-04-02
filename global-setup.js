const { createEnvironment, createExecutor } = require('./src/utils/allure');

module.exports = async () => {
    createEnvironment();
    createExecutor();
};