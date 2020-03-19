const express = require('express');
const router = express.Router();
const db = require('../config/db.config.js');
const { Menu, Module, Menu1 } = require('../helpers/function');
const { ensureAuthenticated, myrole } = require('../helpers/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const _persons = db.Persons;
const _locations = db.Locations;
const _countries = db.Countries;

router.get('/master/persons', ensureAuthenticated, myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);

    _persons.hasMany(_locations,{ sourceKey: 'location_id', foreignKey: 'location_id' });
    _persons.hasMany(_countries,{ sourceKey: 'country_id', foreignKey: 'country_id' });


    _locations.findAll({
        attributes: [
            ['location_id', 'location_id'],
            ['location', 'location'],
        ],
        order: [
            ['location', 'ASC']
        ]
    })
        .then(location => {
            _countries.findAll({
                attributes: [
                    ['country_id', 'country_id'],
                    ['country', 'country'],
                ],
                order: [
                    ['country', 'ASC']
                ]
            })
                .then(country => {
                    _persons.count()
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
                            _persons.findAll({
                                include: [{
                                    model: _locations,
                                    required: true,
                                    attributes: [
                                        ['location', 'location']
                                    ]
                                },{
                                    model: _countries,
                                    required: true,
                                    attributes: [
                                        ['country', 'country']
                                    ]
                                }],
                                order: [
                                    ['created', 'DESC']
                                ],
                                limit: limit,
                                offset: offset,
                            })
                                .then(result => {
                                    let records = [];
                                    for (i = 0; i < result.length; i++) {
                                        records.push({
                                            person_id: result[i].person_id,
                                            name: result[i].name,
                                            age: result[i].age,
                                            status: result[i].status,
                                            country: result[i].tblcountries[0].country,
                                            location: result[i].tbllocations[0].location
                                        });
                                    }

                                    res.render("master/persons", {
                                        systemroles: systemroles,
                                        title: 'Persons',
                                        Persons: records,
                                        location: location,
                                        country: country,
                                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                                    })
                                });
                        });
                });
        });
});


//submit new country
router.post('/person/newperson', (req, res) => {
    let data = {
        person_id: req.body.person_id,
        name: req.body.name,
        age: req.body.age,
        location_id: req.body.location_id,
        country_id: req.body.country_id,
        status: req.body.status
    }
    try {
        _persons.findOne({
            where: { person_id: data.person_id }
        })
            .then(count => {
                if (!count) {
                    _persons.create(data)
                        .then(result => {
                            res.send({ status: 1 });
                        });
                } else {
                    res.send({ status: 2 });
                }
            });
    }
    catch (err) {
        return next(err);
    }
});

//start of search
router.post('/person/search', (req, res) => {
    _persons.hasMany(_locations,{ sourceKey: 'location_id', foreignKey: 'location_id' });
    _persons.hasMany(_countries,{ sourceKey: 'country_id', foreignKey: 'country_id' });

    const personData = {
        searchkey: req.body.searchkey,
        searchfield: req.body.searchfield,
        page: req.body.page
    }

    var field = personData.searchfield;
    var field = field.toLowerCase();
    var whereStatement = {};
    var whereStatement1 = {};
    var whereStatement2 = {};

    if (field === "id") {
        whereStatement.person_id = { [Op.like]: '%' + personData.searchkey + '%' };
    }
    if (field === "name") {
        whereStatement.name = { [Op.like]: '%' + personData.searchkey + '%' };
    }
    if (field === "age") {
        whereStatement.age = { [Op.like]: '%' + personData.searchkey + '%' };
    }
    if (field === "status") {
        whereStatement.status = { [Op.like]: '%' + personData.searchkey + '%' };
    }
    if (field === "nationality") {
        whereStatement2.country = { [Op.like]: '%' + personData.searchkey + '%' };
    }
    if (field === "location") {
        whereStatement1.location = { [Op.like]: '%' + personData.searchkey + '%' };
    }

    if (field === "") {
        whereStatement.person_id = { [Op.like]: '%%' };
    }
    try {
        _persons.count({
            where: whereStatement
        })
            .then(cnt => {
                let page = personData.page || 1;
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
                _persons.findAll({
                    include: [{
                        model: _locations,
                        required: true,
                        attributes: [
                            ['location', 'location']
                        ],
                        where: whereStatement1
                    },{
                        model: _countries,
                        required: true,
                        attributes: [
                            ['country', 'country']
                        ],
                        where: whereStatement2
                    }],
                    order: [
                        ['created', 'DESC']
                    ],
                    where: whereStatement,
                    limit: limit,
                    offset: offset
                }).then(result => {
                    let records = [];
                    for (i = 0; i < result.length; i++) {
                        records.push({
                            person_id: result[i].person_id,
                            name: result[i].name,
                            age: result[i].age,
                            status: result[i].status,
                            country: result[i].tblcountries[0].country,
                            location: result[i].tbllocations[0].location
                        });
                    }
                    res.send({
                        Persons: records,
                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                    })
                });
            });
    } catch (err) {
        return next(err);
    }
});

router.post('/person/edit', (req, res) => {
    _persons.hasMany(_locations,{ sourceKey: 'location_id', foreignKey: 'location_id' });
    _persons.hasMany(_countries,{ sourceKey: 'country_id', foreignKey: 'country_id' });

    _persons.findAll({
        include: [{
            model: _locations,
            required: true,
            attributes: [
                ['location', 'location']
            ]
        },{
            model: _countries,
            required: true,
            attributes: [
                ['country', 'country']
            ]
        }],
        where: {
            person_id: req.body.id
        },

    })
        .then(result => {
            res.send({ person: result });
        });
});


//submit edit country
router.post('/person/editperson', (req, res) => {
    try {
        _persons.update({
            name: req.body.name,
            age: req.body.age,
            location_id: req.body.location_id,
            country_id: req.body.country_id,
            status: req.body.status
        },
            {
                where: {
                    person_id: req.body.person_id
                }
            })
            .then(result => {
                res.send({ status: 1 });
            });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;