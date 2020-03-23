const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const Op = require('sequelize').Op;

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            return next();
        }
        res.redirect('/users/login');
    },
    myrole: function(req, res, next) {
        try {
            
            const finalpath=req.route.path;
            // const path=req.route.path;
            // console.log(path);
            // const splitedpath=path.split("/");
            // let finalpath;

            // if(splitedpath.length<=2){
            //    finalpath="/"+splitedpath[1];
            // }else{
            //    finalpath="/"+splitedpath[1]+"/"+splitedpath[2];
            // }
            _roleassigments.hasMany(_modules, { sourceKey: 'module_id', foreignKey:'module_id'});
            _roleassigments.count({
                    include: [{
                        model: _modules,
                        required: true,
                        attributes: [
                            ['modulename', 'modulename'],
                        ]
                    }],
                    attributes: [
                        ['id', 'id']                   
                    ],
                    where: {
                        [Op.and]: [
                          {
                            '$tblroleassignments.role_id$':req.user.role_id
                          },
                          {
                            '$tblmodules.path$':finalpath
                          }
                          
                        ]
                      }
                })
                .then(roles => {
                    if (roles > 0) {
                        return next();
                    } else {
                        res.status(401).render('index/404', { layout: false, error: 'You are not authorized to view this content', title: "You are not authorized to view this content" });
                        // return next('Unauthorized');
                    }
                })
        } catch (err) {
            return next(err);
        }
    }
}