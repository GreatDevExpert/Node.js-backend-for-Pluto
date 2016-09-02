import database from '../../config/database';

module.exports = {
    User: require('./user'),
    Bank: require('./bank'),
    Account: require('./account'),
    Transaction: require('./transaction'),
    Category: require('./category'),
    Challenge: require('./challenge'),
    Goal: require('./goal'),
    Insight: require('./insight'),
    Unassigned: require('./unassigned')
}
