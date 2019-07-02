(async () => {
    const typeorm = require('typeorm');
    var dbConfig = require('./ormconfig');
    const connection = await typeorm.createConnection(dbConfig);
    jest['connection'] = connection;
    console.log('Jest configure with connection');
    jest.setTimeout(7000);
})();