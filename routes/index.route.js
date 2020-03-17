const express = require('express');
const router = express.Router();
const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const { Menu, Module, Menu1 } = require('../helpers/function');
const { ensureAuthenticated, myrole } = require('../helpers/auth');
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const _roles = db.Roles;
const _users = db.Users;

router.get('/', ensureAuthenticated,myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);
    res.render("index/dashboard", { systemroles: systemroles, title: 'Dashboard' })
});
router.get('/dashboard', ensureAuthenticated,myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);
    res.render("index/dashboard", { systemroles: systemroles, title: 'Dashboard' })

});
router.get('/admin/ajaxuser/page/:page', (req, res) => {
    _roles.count()
    .then(cnt => {
        let page = req.params.page || 1;
        page = parseInt(page);
        const limit = 2;
        const offset = (page - 1) * limit;
        const totalpage = Math.ceil(cnt / limit);
        findbyOffset(limit, offset)
            .then(roles => {
                 res.send({
                     roles: roles,
                     pagination: { page: page, pageCount: totalpage }
                 });

            });
    });
});

const findbyOffset = function(limit, offset) {
    try {
        return _roles.findAll({
            attributes: [
                ['role_id', 'role_id'],
                ['rolename', 'rolename'],
                ['status', 'status']
            ],
            order:[
                ['role_id','DESC']
            ],
            limit: limit,
            offset: offset,
        })
    } catch (err) {
        return next(err);
    }
}
module.exports = router;