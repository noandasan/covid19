const express = require('express');
const router = express.Router();
const db = require('../config/db.config.js');
const { Menu, Module, Menu1 } = require('../helpers/function');
const { ensureAuthenticated, myrole } = require('../helpers/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const _countries = db.Countries;

router.get('/master/countries', ensureAuthenticated,myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);
    _countries.count()
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
            _countries.findAll({
                attributes: [
                    ['country_id', 'country_id'],
                    ['country', 'country']
                ],
                order: [
                    ['country_id', 'DESC']
                ],
                limit: limit,
                offset: offset,
            })
            .then(result=>{
                    let records = [];
                        for (i = 0; i < result.length; i++) {
                            records.push({
                                row_number: (offset + 1) + i,
                                country_id: result[i].country_id,
                                country: result[i].country
                            });
                        }

                res.render("master/countries", {
                    systemroles: systemroles,
                    title: 'Countries',
                    country: records,
                    pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                })
            });
        });
    });
 
   //submit new country
    router.post('/country/newcountry', (req, res) => {
    let data = {
        country: req.body.country
    }
    try {
        _countries.findOne({
            where: { country: data.country }
        })
        .then(count=>{
            if (!count) {
                _countries.create(data)
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
router.post('/country/search', (req, res) => {
   
    const CountryData = {
        searchkey: req.body.searchkey,
        searchfield: req.body.searchfield,
        page: req.body.page
    }

    var field = CountryData.searchfield;
    var field = field.toLowerCase();
    var whereStatement = {};

    if (field === "country") {
        whereStatement.country = { [Op.like]: '%' + CountryData.searchkey + '%' };
    }

    if (field === "") {
        whereStatement.country = { [Op.like]: '%%' };
    }
    try {
        _countries.count({
            where: whereStatement
        })
            .then(cnt => {
                let page = CountryData.page || 1;
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
                _countries.findAll({
                    attributes: [
                        ['country_id', 'country_id'],
                        ['country', 'country'],
                    ],
                    order: [
                        ['country_id', 'DESC']
                    ],
                    where: whereStatement,
                    limit: limit,
                    offset: offset
                }).then(country => {
                    let records = [];
                    for (i = 0; i < country.length; i++) {
                        records.push({
                            row_number: (offset + 1) + i,
                            country_id: country[i].country_id,
                            country: country[i].country
                        });
                    }
                    res.send({
                        country: records,
                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                    })
                });
            });
    } catch (err) {
        return next(err);
    }
});

router.post('/country/edit', (req, res) => {
    _countries.findAll({
        attributes: [
            ['country_id', 'country_id'],
            ['country', 'country'],
          
        ],
        where: {
            country_id: req.body.id
        },

    })
        .then(result => {
            res.send({ country: result });

        });
});


 //submit edit country
 router.post('/country/editcountry', (req, res) => {
    try {
       _countries.update({
        country: req.body.country
       },
       {
           where:{
             country_id: req.body.country_id
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