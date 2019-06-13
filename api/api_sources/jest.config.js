module.exports = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    globalSetup: './sources/test-resources/globalSetup.js',
    globalTeardown: './sources/test-resources/globalTearDown.js'
};