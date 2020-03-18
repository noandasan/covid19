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

router.get('/master/persons', ensureAuthenticated,myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);
    _persons.count()
        .then(cnt=>{
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
                attributes: [
                    ['id', 'id'],
                    ['name', 'name']
                ],
                order: [
                    ['id', 'DESC']
                ],
                limit: limit,
                offset: offset,
            })
            .then(result=>{
                    let records = [];
                        for (i = 0; i < result.length; i++) {
                            records.push({
                                row_number: (offset + 1) + i,
                                id: result[i].id,
                                name: result[i].name
                            });
                        }

                res.render("master/persons", {
                    systemroles: systemroles,
                    title: 'Person',
                    Persons: records,
                    pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                })
            });
        });
    });
 
   //submit new country
    router.post('/country/newlocation', (req, res) => {
    let data = {
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    try {
        _locations.findOne({
            where: { location: data.location }
        })
        .then(count=>{
            if (!count) {
                _locations.create(data)
                .then(result=>{
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
router.post('/location/search', (req, res) => {
   
    const locationData = {
        searchkey: req.body.searchkey,
        searchfield: req.body.searchfield,
        page: req.body.page
    }

    var field = locationData.searchfield;
    var field = field.toLowerCase();
    var whereStatement = {};

    if (field === "location") {
        whereStatement.location = { [Op.like]: '%' + locationData.searchkey + '%' };
    }

    if (field === "") {
        whereStatement.location = { [Op.like]: '%%' };
    }
    try {
        _locations.count({
            where: whereStatement
        })
            .then(cnt => {
                let page = locationData.page || 1;
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
                _locations.findAll({
                    attributes: [
                        ['location_id', 'location_id'],
                        ['location', 'location'],
                    ],
                    order: [
                        ['location_id', 'DESC']
                    ],
                    where: whereStatement,
                    limit: limit,
                    offset: offset
                }).then(location => {
                    let records = [];
                    for (i = 0; i < location.length; i++) {
                        records.push({
                            row_number: (offset + 1) + i,
                            location_id: location[i].location_id,
                            location: location[i].location,
                            latitude: location[i].latitude,
                            latitude: location[i].latitude
                        });
                    }
                    res.send({
                        location: records,
                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                    })
                });
            });
    } catch (err) {
        return next(err);
    }
});

router.post('/location/edit', (req, res) => {
    _locations.findAll({
        attributes: [
            ['location_id', 'location_id'],
            ['location', 'location'],
            ['latitude', 'latitude'],
            ['longitude', 'longitude'],
          
        ],
        where: {
            location_id: req.body.id
        },

    })
        .then(result => {
            res.send({ locations: result });

        });
});


 //submit edit country
 router.post('/location/editlocation', (req, res) => {
    try {
       _locations.update({
        location: req.body.location,
        latitude: req.body.latitude,
        latitude: req.body.latitude
       },
       {
           where:{
            location_id: req.body.location_id
           }
       })
       .then(result=>{
             res.send({ status: 1 });
       });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;