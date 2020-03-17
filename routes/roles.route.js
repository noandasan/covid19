const express = require('express');
const router = express.Router();
const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Menu } = require('../helpers/function');
const { ensureAuthenticated, myrole } = require('../helpers/auth');
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const _roles = db.Roles;
const _controls = db.Controls;
const _controlsassigments = db.Controlassigments;


router.get('/admin/roles', ensureAuthenticated, myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);
    _roles.count()
        .then(cnt => {
            let page = req.params.page || 1;
            page = parseInt(page);
            const limit = 20;
            const a = limit * page;
            const offset = (page - 1) * limit;
            const x = page * limit;
            let y; let z; let b;
            if (x > cnt) {
                y = x - cnt;
                z = 20 - y;
                b = z + offset;
            } else {
                b = page * limit;
            }
            const totalpage = Math.ceil(cnt / limit);
            findbyOffset(limit, offset)
                .then(roles => {
                    let records = [];
                    for (i = 0; i < roles.length; i++) {
                        records.push({
                            row_number: (offset + 1) + i,
                            role_id: roles[i].role_id,
                            rolename: roles[i].rolename,
                            status: roles[i].status
                        });
                    }
                    res.render("admin/roles", {
                        systemroles: systemroles,
                        title: 'Roles',
                        roles: records,
                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                    })
                });
        });
});

const findbyOffset = function (limit, offset) {
    try {
        return _roles.findAll({
            attributes: [
                ['role_id', 'role_id'],
                ['rolename', 'rolename'],
                ['status', 'status']
            ],
            order: [
                ['role_id', 'DESC']
            ],
            limit: limit,
            offset: offset,
        })
    } catch (err) {
        return next(err);
    }
}

router.post('/admin/roles/roleonoff', (req, res) => {
    let status;
    if (req.body.value == 'on') {
        status = '1'
    } else {
        status = '0'
    }
    try {
        _roles.update({
            status: status
        }, {
            where: {
                role_id: req.body.id
            }
        })
            .then(result => {
                res.send({ status: "OK" });
            });
    } catch (err) {
        return next(err);
    }
});

router.get('/admin/roles/loadmodules', (req, res) => {
    _modules.hasMany(_controls, { sourceKey: 'module_id', foreignKey: 'module_id' });
    _modules.findAll({
        attributes: [
            ['module_id', 'module_id'],
            ['modulename', 'modulename'],
            ['icon', 'icon']
        ],
        include: [{
            model: _controls,
            required: true,
            attributes: [
                ['control_id', 'control_id'],
                ['controlname', 'controlname'],
            ]
        }]
    })
        .then(result => {
            res.send({ modules: result });

        });
});

//submit new role
router.post('/admin/roles/newrole', (req, res) => {
    let controlAssigment = [];
    let controlAssingment = req.body.controlAssingment;
    let data = {
        rolename: req.body.rolename,
        status: '1'
    }
    try {
        _roles.create(data)
            .then(result => {
                for (i = 0; i < controlAssingment.length; i++) {
                    controlAssigment.push({
                        role_id: result.null,
                        module_id: controlAssingment[i].module_id,
                        control_id: controlAssingment[i].control_id,
                        status: controlAssingment[i].status
                    });
                }
                _controlsassigments.bulkCreate(controlAssigment);
                _roles.count()
                    .then(cnt => {
                        let page = req.params.page || 1;
                        page = parseInt(page);
                        const limit = 20;
                        const offset = (page - 1) * limit;
                        const x = page * limit;
                        let y; let z; let b;
                        if (x > cnt) {
                            y = x - cnt;
                            z = 20 - y;
                            b = z + offset;
                        } else {
                            b = page * limit;
                        }
                        const totalpage = Math.ceil(cnt / limit);
                        findbyOffset(limit, offset)
                            .then(roles => {
                                let records = [];
                                for (i = 0; i < roles.length; i++) {
                                    records.push({
                                        row_number: (offset + 1) + i,
                                        role_id: roles[i].role_id,
                                        rolename: roles[i].rolename,
                                        status: roles[i].status
                                    });
                                }
                                res.send({
                                    roles: records,
                                    pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                                })
                            });
                    });
            });
    } catch (err) {
        return next(err);
    }
});

//edit role
router.post('/admin/roles/editrole', (req, res) => {
    let controlAssigment = [];
    let controlAssingmentRec = req.body.controlAssingment;
    try {

        _roles.update({
            rolename: req.body.rolename
        }, {
            where: {
                role_id: req.body.role_id
            }
        })
            .then(result => {
                _controlsassigments.destroy({
                    where: {
                        role_id: req.body.role_id
                    }
                })
                    .then(result => {
                        for (i = 0; i < controlAssingmentRec.length; i++) {
                            controlAssigment.push({
                                role_id: req.body.role_id,
                                module_id: controlAssingmentRec[i].module_id,
                                control_id: controlAssingmentRec[i].control_id,
                                status: controlAssingmentRec[i].status
                            });
                        }
                        _controlsassigments.bulkCreate(controlAssigment);
                        _roles.count()
                            .then(cnt => {
                                let page = req.params.page || 1;
                                page = parseInt(page);
                                const limit = 20;
                                const offset = (page - 1) * limit;
                                const x = page * limit;
                                let y; let z; let b;
                                if (x > cnt) {
                                    y = x - cnt;
                                    z = 20 - y;
                                    b = z + offset;
                                } else {
                                    b = page * limit;
                                }
                                const totalpage = Math.ceil(cnt / limit);
                                findbyOffset(limit, offset)
                                    .then(roles => {
                                        let records = [];
                                        for (i = 0; i < roles.length; i++) {
                                            records.push({
                                                row_number: (offset + 1) + i,
                                                role_id: roles[i].role_id,
                                                rolename: roles[i].rolename,
                                                status: roles[i].status
                                            });
                                        }
                                        res.send({
                                            roles: records,
                                            pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                                        })
                                    });
                            });
                    });
            });



    } catch (err) {
        return next(err);
    }
});
// edit role get id
router.get('/admin/roles/edit/role_id/:role_id', ensureAuthenticated, (req, res) => {
    _modules.hasMany(_controls, { sourceKey: 'module_id', foreignKey: 'module_id' });
    _controls.hasMany(_controlsassigments, { sourceKey: 'control_id', foreignKey: 'control_id' });
    _controlsassigments.hasMany(_roles, { sourceKey: 'role_id', foreignKey: 'role_id' });
    _modules.findAll({
        attributes: [
            ['module_id', 'module_id'],
            ['modulename', 'modulename'],
            ['icon', 'icon']
        ],
        include: [{
            model: _controls,
            required: true,
            attributes: [
                ['control_id', 'control_id'],
                ['controlname', 'controlname'],
            ],
            include: [{
                model: _controlsassigments,
                required: true,
                attributes: [
                    ['id', 'id'],
                    ['status', 'status'],
                ],
                include: [{
                    model: _roles,
                    required: true,
                    attributes: [
                        ['role_id', 'role_id'],
                        ['rolename', 'rolename'],
                    ],
                    where: { role_id: req.params.role_id },
                }]
            }]
        }]
    })
        .then(result => {
            res.send({ roles: result });

        });
});

//search
router.post('/admin/roles/search', (req, res) => {
    const RoleData = {
        searchkey: req.body.searchkey,
        searchfield: req.body.searchfield,
        page: req.body.page
    }
    var field = RoleData.searchfield;
    var field = field.toLowerCase();
    var whereStatement = {};


    if (field === "rolename") {
        whereStatement.rolename = { [Op.like]: '%' + RoleData.searchkey + '%' };
    }
    if (field === "status") {
        whereStatement.status = { [Op.eq]: '' + RoleData.searchkey + '' };
    }
    if (field === "") {
        whereStatement.rolename = { [Op.like]: '%%' };
    }

    try {
        _roles.count({
            where: whereStatement
        })
            .then(cnt => {
                let page = RoleData.page || 1;
                page = parseInt(page);
                const limit = 20;
                const offset = (page - 1) * limit;
                const x = page * limit;
                let y; let z; let b;
                if (x > cnt) {
                    y = x - cnt;
                    z = 20 - y;
                    b = z + offset;
                } else {
                    b = page * limit;
                }
                const totalpage = Math.ceil(cnt / limit);
                _roles.findAll({
                    attributes: [
                        ['role_id', 'role_id'],
                        ['rolename', 'rolename'],
                        ['status', 'status']
                    ],
                    order: [
                        ['role_id', 'DESC']
                    ],
                    where: whereStatement,
                    limit: limit,
                    offset: offset,
                }).then(roles => {
                    let records = [];
                    for (i = 0; i < roles.length; i++) {
                        records.push({
                            row_number: (offset + 1) + i,
                            role_id: roles[i].role_id,
                            rolename: roles[i].rolename,
                            status: roles[i].status
                        });
                    }
                    res.send({
                        roles: records,
                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                    })
                });
            });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;