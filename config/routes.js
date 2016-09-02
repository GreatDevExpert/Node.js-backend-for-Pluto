import tokenCtrl from '../api/controllers/token';
import usersCtrl from '../api/controllers/user';
import categoryCtrl from '../api/controllers/category';
import bankCtrl from '../api/controllers/bank';
import accountCtrl from '../api/controllers/account';
import transactionCtrl from '../api/controllers/transaction';
import goalCtrl from '../api/controllers/goal';
import challengeCtrl from '../api/controllers/challenge';
import insightCtrl from '../api/controllers/insight';
import unassignedCtrl from '../api/controllers/unassigned';

import webhookCtrl from '../api/controllers/webhook';

import resError from '../api/middlewares/res_error';
import resSuccess from '../api/middlewares/res_success';
import modelMagic from '../api/middlewares/model_magic';


let multer = require('multer');

let avatarUpload = multer({ dest: 'uploads/avatar',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    }
});

let env = process.env.NODE_ENV || 'development';

module.exports = function ( app, passport ){

    let router = require(`express-promise-router`)();
    app.use(resError);
    app.use(resSuccess);
    router.use(resError);
    router.use(resSuccess);

    router.post('/register', usersCtrl.signup);
    router.post('/login',usersCtrl.login);

    router.all('/users/:id*', modelMagic('User'));
    router.all('/categories/:id*', modelMagic('Category'));
    router.all('/banks/:id*', modelMagic('Bank'));
    router.all('/accounts/:id*', modelMagic('Account'));
    router.all('/transactions/:id*', modelMagic('Transaction'));
    router.all('/goals/:id*', modelMagic('Goal'));
    router.all('/challenges/:id*', modelMagic('Challenge'));
    router.all('/insights/:id*', modelMagic('Insight'));
    router.all('/unassigneds/:id*', modelMagic('Unassigned'));

    router.post('/webhook', webhookCtrl.webhook);

    router.use(tokenCtrl.ensureAuthenticated);

    router.get('/me', usersCtrl.show);
    router.put('/me', usersCtrl.updateMe);
    router.put('/me/clearToken', usersCtrl.clearToken);

    router.get('/users', tokenCtrl.ensureAdmin, usersCtrl.index);
    router.put('/users/:id', tokenCtrl.ensureAdmin, usersCtrl.update);
    router.delete('/users/:id', tokenCtrl.ensureAdmin, usersCtrl.destroy);

    router.get('/categories', categoryCtrl.index);
    router.get('/categories/:id', categoryCtrl.show);
    router.delete('/categories/:id', tokenCtrl.ensureAdmin, categoryCtrl.destroy);
    router.put('/categories/:id', tokenCtrl.ensureAdmin, categoryCtrl.update);
    router.post('/categories', tokenCtrl.ensureAdmin, categoryCtrl.create);

    router.get('/banks', bankCtrl.index);
    router.get('/banks/:id', bankCtrl.show);
    router.delete('/banks/:id', bankCtrl.destroy);
    router.put('/banks/:id', bankCtrl.update);
    router.post('/banks', bankCtrl.create);
    router.post('/addConnectUser', bankCtrl.addConnectUser);

    router.get('/accounts', accountCtrl.index);
    router.get('/accounts/:id', accountCtrl.show);
    router.delete('/accounts/:id', accountCtrl.destroy);
    router.put('/accounts/:id', accountCtrl.update);
    router.post('/accounts', accountCtrl.create);

    router.get('/transactions', transactionCtrl.index);
    router.get('/transactions/:id', transactionCtrl.show);
    router.delete('/transactions/:id', transactionCtrl.destroy);
    router.put('/transactions/:id', transactionCtrl.update);
    router.post('/transactions', transactionCtrl.create);

    router.get('/goals', goalCtrl.index);
    router.get('/goals/:id', goalCtrl.show);
    router.delete('/goals/:id', goalCtrl.destroy);
    router.put('/goals/:id', goalCtrl.update);
    router.post('/goals/:id/updateCompleteNotificationFlag', goalCtrl.updateCompleteNotificationFlag());
    router.post('/goals/:id/updateFivePercentNotificationFlag', goalCtrl.updateFivePercentNotificationFlag());
    router.post('/goals', goalCtrl.create);

    router.get('/challenges', challengeCtrl.index);
    router.get('/challenges/:id', challengeCtrl.show);
    router.delete('/challenges/:id', challengeCtrl.destroy);
    router.put('/challenges/:id', challengeCtrl.update);
    router.put('/challenges/:id/goals/:id', challengeCtrl.addGoal);
    router.post('/challenges', challengeCtrl.create);

    router.get('/insights', insightCtrl.index);
    router.get('/insights/:id', insightCtrl.show);
    router.delete('/insights/:id', insightCtrl.destroy);
    router.put('/insights/:id', insightCtrl.update);
    router.post('/insights', insightCtrl.create);

    router.get('/unassigneds', unassignedCtrl.index);
    router.get('/unassigneds/:id', unassignedCtrl.show);
    router.delete('/unassigneds/:id', unassignedCtrl.destroy);
    router.put('/unassigneds/:id', unassignedCtrl.update);
    router.post('/unassigneds', unassignedCtrl.create);

    app.use('/api/v1', router);
}