const nodeEnv = process.env.NODE_ENV;
module.exports = {
    isDocker : () => {
        return nodeEnv === 'docker';
    },
    isUnitTest: () => {
        return nodeEnv === 'unit_test';
    },
    testDB: "db_test"

}