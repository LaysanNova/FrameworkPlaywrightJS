const fs = require('fs');
const os = require('os');

function createEnvironment() {
    const data = {
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        node_version: process.version,
        env: process.env.ENV || 'local',
        browser: process.env.BROWSER || 'chromium',
        base_url: process.env.URL || 'not set',
        table_url: process.env.TABLE_URL || 'not set',
    };

    const content = Object.entries(data)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');

    if (!fs.existsSync('allure-results')) {
        fs.mkdirSync('allure-results');
    }

    fs.writeFileSync('allure-results/environment.properties', content);
}

function createExecutor() {
    const content = {
        name: process.env.GITHUB_ACTIONS
            ? 'GitHub Actions'
            : process.env.JENKINS_URL
                ? 'Jenkins'
                : 'Local',

        type: process.env.GITHUB_ACTIONS
            ? 'github'
            : process.env.JENKINS_URL
                ? 'jenkins'
                : 'local',

        buildName: process.env.GITHUB_RUN_ID || process.env.BUILD_NUMBER || 'manual',
        buildUrl: process.env.BUILD_URL || '',
    };

    fs.writeFileSync(
        'allure-results/executor.json',
        JSON.stringify(content, null, 2)
    );
}

module.exports = {
    createEnvironment,
    createExecutor,
};