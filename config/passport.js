const LocalStrategy=require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const _users = db.Users;


module.exports=function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        _users.findOne({
            where: { email: email }
          })
          .then(user=>{
              if(!user){
                return done(null, false, {message: 'No user found.'});
              }
            bcrypt.compare(password, user.password,(err, isMatch)=>{
                  if(err) throw err;
                  if(isMatch)  {
                 // console.log(user);
                    return done(null, user);
                  }else{
                    return done(null, false, {message: 'Password Incorrect'});
                  }
            });
          })
    }));

    passport.serializeUser(function(user,done){
            done(null, user.id)
    });

    passport.deserializeUser(function(id, done) {
       _users.findByPk(id).then(function(user) {
             if (user) {
                 done(null, user.get());
             } else {
                 done(user.errors, null);
             }
         });
     });
}