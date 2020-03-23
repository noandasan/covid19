const express = require('express');
const router = express.Router();
const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const { Menu} = require('../helpers/function');
const { ensureAuthenticated, myrole } = require('../helpers/auth');
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const _roles = db.Roles;
const _users = db.Users;
const _persons = db.Persons;
const _countries = db.Countries;
const _locations = db.Locations;

router.get('/mapping', (req, res) => {
    var a =  {
        "type":"FeatureCollection",
        "features":[
           {
          "type":"Feature",
          "properties":{"mag":4},
          "geometry":{"type":"Point","coordinates":[39.581840,24.521620]}
          },
           {
          "type":"Feature",
          "properties":{"mag":30},
          "geometry":{"type":"Point","coordinates":[49.550326,27.036795]}
          },
  
         ]
    }   
    _persons.findAll({
        include: [{
            model: _locations,
            required: true,
            attributes: [
                'location',
                'latitude',
                'longitude',
                [Sequelize.fn('count', Sequelize.col('location')), 'cnt']
            ]
        }],
        group: ['location'],
        order: [[Sequelize.literal('`tbllocations.cnt`'), 'DESC']]
    })
        .then(result => {
            let records ={};

        
          var lati;
          var longti;

var b;
var x; var obj;


            b='{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"mag": "0"},"geometry":{"type":"Point","coordinates":[26.9716430,49.5769590]}}]}';

            var obj = JSON.parse(b);

            for (i = 0; i < result.length; i++) {
               lati= parseFloat(result[i].tbllocations[0].latitude);
               longti=parseFloat(result[i].tbllocations[0].longitude);

               obj['features'].push({
                "type":"Feature",
                "properties":{"mag": result[i].tbllocations[0].dataValues.cnt},
                "geometry":{"type":"Point","coordinates":[longti,lati]}
                });
            }
          
          //  var jsonStr = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}';

         // var obj = JSON.parse(obj);
         //   obj['theTeam'].push({"teamId":"4","status":"pending"});
           jsonStr = JSON.stringify(obj);
           obj = JSON.parse(jsonStr);

           // console.log(obj);
                 

            res.send({person:obj});
        });

});



router.get('/', (req, res) => {
    _persons.hasMany(_locations,{ sourceKey: 'location_id', foreignKey: 'location_id' });
    _persons.hasMany(_countries,{ sourceKey: 'country_id', foreignKey: 'country_id' });

_persons.count()
.then(totalconfirmed=>{

        _persons.count({
            where:{
                status: 'Confirmed Case'
            }
        }).then(confirmed=>{
            _persons.count({
                where:{
                    status: 'Recovered Case'
                }
            }).then(recovered=>{
                _persons.count({
                    where:{
                        status: 'Fatal Case'
                    }
                }).then(fatal=>{
                    _persons.findAll({
                        include: [{
                            model: _countries,
                            required: true,
                            attributes: [
                                'country',
                                [Sequelize.fn('count', Sequelize.col('country')), 'cnt']
                            ]
                        }],
                        group: ['country'],
                        order: [[Sequelize.literal('`tblcountries.cnt`'), 'DESC']]
                    })
                    .then(result=>{
                
                        let nationality = [];
                            for (i = 0; i < result.length; i++) {
                                nationality.push({
                                    person_id: result[i].person_id,
                                    name: result[i].name,
                                    age: result[i].age,
                                    country: result[i].tblcountries[0].country,
                                    cnt: result[i].tblcountries[0].dataValues.cnt
                                });
                            }
                    _persons.findAll({
                        include: [{
                            model: _locations,
                            required: true,
                            attributes: [
                                'location',
                                [Sequelize.fn('count', Sequelize.col('location')), 'cnt']
                            ]
                        }],
                        group: ['location'],
                        order: [[Sequelize.literal('`tbllocations.cnt`'), 'DESC']]
                    
                    
                    })
                        .then(result => {
                        
                            let records = [];
                            for (i = 0; i < result.length; i++) {
                                
                            console.log();
                                records.push({
                                    person_id: result[i].person_id,
                                    name: result[i].name,
                                    age: result[i].age,
                                    location: result[i].tbllocations[0].location,
                                    cnt: result[i].tbllocations[0].dataValues.cnt
                                });
                            }
                        //    console.log(records);
                        //var person = JSON.parse(person);
                                res.render("covid19",
                                    {
                                 
                                    totalconfirmed: totalconfirmed,
                                    confirmed: confirmed,
                                    recovered: recovered,
                                    fatal:fatal,
                                    infected: records,  
                                    nationality:nationality,
                                    layout: false
                                })
                               
                        }); 
                        
                    })
                });
            });
        });
});



   
  
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