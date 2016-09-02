'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _apiControllersToken = require('../api/controllers/token');

var _apiControllersToken2 = _interopRequireDefault(_apiControllersToken);

var _apiControllersUser = require('../api/controllers/user');

var _apiControllersUser2 = _interopRequireDefault(_apiControllersUser);

var _apiControllersCategory = require('../api/controllers/category');

var _apiControllersCategory2 = _interopRequireDefault(_apiControllersCategory);

var _apiMiddlewaresRes_error = require('../api/middlewares/res_error');

var _apiMiddlewaresRes_error2 = _interopRequireDefault(_apiMiddlewaresRes_error);

var _apiMiddlewaresRes_success = require('../api/middlewares/res_success');

var _apiMiddlewaresRes_success2 = _interopRequireDefault(_apiMiddlewaresRes_success);

var _apiMiddlewaresModel_magic = require('../api/middlewares/model_magic');

var _apiMiddlewaresModel_magic2 = _interopRequireDefault(_apiMiddlewaresModel_magic);

var multer = require('multer');

var menuimageUpload = multer({ dest: 'uploads/menuitem',
    rename: function rename(fieldname, filename) {
        return filename + Date.now();
    }
});

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {

    var router = require('express-promise-router')();
    app.use(_apiMiddlewaresRes_error2['default']);
    app.use(_apiMiddlewaresRes_success2['default']);
    router.use(_apiMiddlewaresRes_error2['default']);
    router.use(_apiMiddlewaresRes_success2['default']);

    router.post('/register', _apiControllersUser2['default'].signup);
    router.post('/login', _apiControllersUser2['default'].login);

    router.all('/categories/:id*', (0, _apiMiddlewaresModel_magic2['default'])('Category'));
    router.all('/users/:id*', (0, _apiMiddlewaresModel_magic2['default'])('User'));

    router.use(_apiControllersToken2['default'].ensureAuthenticated);

    router.get('/categories', _apiControllersCategory2['default'].index);
    router.get('/categories/:id', _apiControllersCategory2['default'].show);
    router['delete']('/categories/:id', _apiControllersToken2['default'].ensureAdmin, _apiControllersCategory2['default'].destroy);
    router.put('/categories/:id', _apiControllersToken2['default'].ensureAdmin, _apiControllersCategory2['default'].update);
    router.post('/categories', _apiControllersToken2['default'].ensureAdmin, _apiControllersCategory2['default'].create);

    router.get('/me', _apiControllersUser2['default'].show);
    router.put('/me', _apiControllersUser2['default'].updateMe);

    router.get('/users', _apiControllersToken2['default'].ensureAdmin, _apiControllersUser2['default'].index);
    router.put('/users/:id', _apiControllersToken2['default'].ensureAdmin, _apiControllersUser2['default'].update);
    router['delete']('/users/:id', _apiControllersToken2['default'].ensureAdmin, _apiControllersUser2['default'].destory);

    app.use('/api/v1', router);
};