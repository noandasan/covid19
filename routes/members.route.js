const express = require('express');
const router = express.Router();
const db = require('../config/db.config.js');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const fs = require('fs');
var multer = require('multer');
const Op = Sequelize.Op;
const { Menu } = require('../helpers/function');
const { ensureAuthenticated, myrole } = require('../helpers/auth');
const _members = db.Users;
const _roleassigments = db.Roleassigments;
const _modules = db.Modules;
const _roles = db.Roles;

router.get('/admin/members', ensureAuthenticated, myrole, (req, res) => {
    const systemroles = Menu(req.user.role_id, _roleassigments, _modules);
    _roles.findAll({
        attributes: [
            ['role_id', 'role_id'],
            ['rolename', 'rolename']
        ],
        order: [
            ['role_id', 'DESC']
        ],
        where: {
            status: '1'
        }
    }).then(roles => {
        _members.count()
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
                    .then(result => {
                        let records = [];
                        for (i = 0; i < result.length; i++) {

                            records.push({
                                row_number: (offset + 1) + i,
                                id: result[i].id,
                                email: result[i].email,
                                name: result[i].name,
                                role_id: result[i].role_id,
                                rolename: result[i].tblroles[0].rolename,
                                status: result[i].status
                            });
                        }
                        res.render("admin/members", {
                            systemroles: systemroles,
                            roles: roles,
                            title: 'Members',
                            members: records,
                            pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                        })
                    });
            });
    });
});
// offset
const findbyOffset = function (limit, offset) {
    _members.hasMany(_roles, { sourceKey: 'role_id', foreignKey: 'role_id' });
    try {
        return _members.findAll({
            include: [{
                model: _roles,
                required: true,
                attributes: [
                    ['role_id', 'role_id'],
                    ['rolename', 'rolename'],
                ]
            }],
            order: [
                ['id', 'DESC']
            ],
            limit: limit,
            offset: offset,
        })
    } catch (err) {
        return next(err);
    }
}

//submit new role
router.post('/admin/members/newmember', (req, res) => {
    let data = {
        email: req.body.email,
        name: req.body.name,
        role_id: req.body.role_id,
        password: req.body.password
    }

    try {
        _members.findOne({
            where: { email: data.email }
        })
            .then(members => {
                if (!members) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(data.password, salt, (err, hash) => {
                            if (err) throw err;
                            data.password = hash;
                            _members.create(data)
                                .then(result => {
                                    let userId = result.null;
                                    var dir = './static/img/' + userId + '/';

                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    var imgData;
                                    if (!req.body.profile){
                                        imgData ="data:image/png;base64,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"
                                    }else{
                                       imgData = req.body.profile;
                                    }

                                   
                                    var base64Data = imgData.replace(/^data:image\/png;base64,/, "");
                                    var nTimestamp = Date.now();


                                    require("fs").writeFile("./static/img/" + userId + "/" + userId + "-" + nTimestamp + ".jpg", base64Data, 'base64',
                                        function (err, data) {
                                            if (err) {
                                                console.log('err', err);
                                            }
                                            else{
                                                _members.update({
                                                    profile: userId + "-" + nTimestamp + ".jpg"
                                                },
                                                    {
                                                        where: {
                                                            id: userId
                                                        }
                                                    })
                                                    .then(result => {
                                                        res.send({ status: 1 });
                                                    })
                                            }
                                        });
                                });
                        });
                    });

                } else {
                    res.send({ status: 2 });
                }
            });

    } catch (err) {
        return next(err);
    }
});

// save edit member
//submit new role
router.post('/admin/members/editmember', (req, res) => {

    var dir = './static/img/' + req.body.id + '/';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var imgData;
    if (!req.body.profile){
        imgData ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAgAElEQVR4Xu19e6xcV3X+2nNvHDuxHRMgcUIDje/Zk4crKlElARKQTP0gKTSo0EABtQTUQFsKlCCVtGopVDRUIrxKW0LFo/0B5dFWpEBCYpf8QQIkUZFaxXnMGTuEFMdxiDGOsYNz7+yfvsl8l+XtMzNnZs6ZOY99pNG9d+45++y91v72eu61jYSrdBTYs2fPSYcOHXqOiPySiDzLGLNeRE4XkWc45041xjxNRNaKyGoRwX3HXMaY48a8tLT0YKPROCQiB51zPzHG7BeRH4vII865vSLyIxH5v9WrVz945plnHi4d0Wre4eM5XnOCFGn47XY7cs5tFJHzjDHnOOesMWaDc+6MPPvpLwTOueXXdTodMcY8bIzZbYyJnXP3i8i9xpidURS18+xXaHt8CgSgj0+7TJ+M4/h8Y8wFnU7n14wxzxMRfFb5LyHokqTyuB3SQO7Xrr6n33uMMUdE5PvOue83Go3/ds7dZa29Z9x+heeyo0AAena0HKmldrt9sXPuRSJysYhsFpGVIzWQ8c3DFhD+v9FodN+sge8/i8VC/f8JEdkhIrcbY74dRdHtGXc9NJeCAgHoKYiUxS2tVus8EdlijPl1EXlJz34+rmkAREvVSSQsGk8r+dNIbAK8X/9StgE/wLecc/8lItubzea9WdA3tDGYAgHoOc6Qdru9yTn3MhG5FHb2uK/yJORIzSSBLwn84y4I/TSBYRqCWjQA9JuMMV+PoujWkQYXbk5NgQD01KRKd2Or1drSaDR+S0Quz9Jp5gN2EDCH2dyDgN5PKvMZ/n+Q9Ma9cNoN0yh87UVE9hpjvtrpdP6j2WxuT0fxcFcaCgSgp6HSkHt27doFJ9qrReQKETkrgyaHqvT6BgCLQPR/9gNmP6AOA7rfPvuB5/jJaPwPichXGo3GFxcWFu7KqM3aNhOAPibrH3jggXVPPvnk74rI6+EtH7OZ1I8lAcwHZRJIIVk1AH1AJi0E/bQH9GFubm5ZUsMxx0Vm0AJANT31YL0b4b0Xkc+dcMIJ/3L22WcfGLedOj8XgD4i93ve8jeKyJXwdY34+Ei3+yq2ltxoCCDGZ2lpSRYXF5c/+BsfrRprgCeBPcmLzs5qEAPo/t8nnHCCrFixovvB77hHLyD++/TzKR14y4qDiHzGGPPp4L0faSrlO1FH60qx747j+HUi8oci8sJxekqHGic9paOWtvgOAIWknJ+f7/7Ehe+efPLJLpAJ7p///OfHAJxg99vz+9rPfh/FGedrAXgW/QXQTzzxxGN+chxckHyTw7flk3wBvSSdZe0BbRhjvmOM+YeFhYXPj8OPuj2Tq0QqOzF37ty5YsWKFW8VkT8XkVOzGg8ns57klNYABr4HsPE5evTo8u8a6Ph9VJU4LZjTjFMDUnvY9TgwFgAfn5UrV3alPRYv3M8Fy9cahjn5lkV7zycgIvuNMe8/evToxzdu3Hg0Td/reE8AegLX4zhGnvg7ROTtWQJcT2razlBzOfkBXkx0gBsS+4knnuj+TjVcg8CXclmCeBgQ9Lt8Fd1/FmMDwAF0fCD1sQDocXPBSjIfkswXmi09yU5T4jHn3MdE5CPW2oPDxlC3/wegK47fd999a+bm5t4lIu/sl9CS1QSh/YwJD9AC0IcPH+4CnNKcEpxSks6vQX2giZBVPwe1oyW5fx/NECxSNFMAcIAeEn7VqlVd4NM88Z+ntpPULhcG7bNQJhEScq5bWlq67txzz318GnQowzsC0HtciuP43SLypyKyLm/GceLjJ0D9s5/9TB5//PEu0AEMXACA9mr7zjTf4eWrwARBP8D4Y0zrFOunOfiqPLUU/R5qJvgf7fk1a9Z0wU9bXps17JNOu+3nYyD41fvgnf9ba+0H8uZnGdqvPdDb7fZVzjnY4M/Ok2GYwFS3Manx95EjR+SnP/2pHDp0qCvJMYkBAH1p550vwfz7kvqftUqvTQaqzv3o5kt82uUawBr0J510UlfSQ+LjYvSA7+T79CKm34G2Eha2B40xfxNF0Sfz5G/R264t0Nvt9qXOufeIyEXTZBIlHYC9f//+rhTH5KTUSgvMQWrzsPEkSe+07+1nnyeBUEtZf5Gij0KbJdBSoM6ffPLJx9nyAD2f8ReYlLS4wxjz3iiKbhpGnyr+v3ZAb7VaG4wxfy0ir50mQzEZmWwCkEOSHzhwoDt58T3/xz5pSZ5XP9Oq675ZMEiTSLKbeb+2x3UYkAsCvqOEpy1PJx60IHrrh4UQh9DrC865v2g2m7vzomsR260V0Ht2+LWzYAQmJyYvbPKDBw/KT37yk64Djt5nOtH6ha38Pg9yutHRN0i19kGeFvT6vYO0gGFOQT1ODXQdcmR4Duo8bHna8RrwemHRKn4KHl9TJ/u9FkDv7SL7uIicn2IC5HYLQA3H22OPPdZ1vsEep9edkn3YZpAkNdUHXBrQ+veMorrrkFqStOdC4y84viSmZ55g5f38nqo6AA51HjY81Xrcw3CkrxGMwMB7jDFvrcOuucoDPY7jD4rI1SMwf/lWPfHwJUNFVEEHSZAk4OA7SHLY5gS2nqSDJPA4/S/7M3oxAqhBd4D9aU97mqxdi1QH6WpI5AOdcb6X3o8AJDjtrrPWIqxa2auyQMd2UWPMh0UENddGvrQ00g8TwFpl9BtPkqicXJDmGuhamo3cyRo9oL39kPCw3QF2qPXQipgC7POlHx8TSLfTOfcnVd0eW0mgx3H8NyJyzaQ4oJ3JycINHQwTpZXoaAdAh1SCRIcjjp5231adtM9Vf1576yHdAXb8ZOpwPyfmCIC/1lr7Z1WjY6WAvnv37ucuLi7+vTHmkkkZ5TudCEiAlTnoTG7RUp7qt5Ys/D/uRzgNH048nfsdVPf+XNO+Ce2Mg2SHow4fxN/9HHrdYlqwO+dum5+f/6MNGzb876TzqCjPVwbo7Xb7951zmSVFUDJwJxkYhsQWSGNmsGk7POn3JCeZlkhokxluaSdhUSbOtPuRpAHhOyyeiGYA6Keeemr3d1wa8L6NPiwiwLEZY66Kouifpj3WPN5XCaC32+1POOfenDWBdNwbITF4yhEDx8WNGTqJg+/XNrqWRJTyXAC06s8YchqPedbjLEt72pRCn+n34CIAe/3pT396136n5x4LAU2uceLvxpjroyh6S1lo1K+fpQY6aqGLyKdE5PlZMwITBRMEwEZii05u0RMuaVPGILBq55uW4gHo6TmoF0o+xQUX4bdTTjmlG4bDYsyMOt8US/+27p3fE5E3lblGfWmB3mq1XmmM+YyIrBmRaaluB8iR0AIpDmmOvHRK8X4OH98eVCpg99ck9dx3+KXqXI1v6ue8JNABbKjx69at64KdHnmdn5BWdffI/Lhz7spms/nvZSR/KYE+jQw3TBBKckh1TA7t2QWzmeziMz5JoifZ6368Nyn2XsZJNa0++6DH3+AV+LJ69equZMdPfM/kmgzCmaXMqCsd0POyx/3JCQnw4x//uCvRAVw4eXxHmt6MkmZy64mpVXVtx6dpp473YFHU21xByyQpjcUYzlLcD8n+jGc8o2uz0zmXhdOzjHZ7aYCOqi/OuX81xlyW1UT3bT3a5ZgkADli3szI4kTTxR+C4ywrTmTXDtVyLspIMz7rrLO66cb00pOXeOsgLWrQouCcu9EY8ztlqWZTCqD3ThX9Uu/gwYlmxSDmUa0DuB955JHleLdOlPHDaAHsE7Ej84e1z4NRDYTdoMZTK9Oa2DieeNXp7xtjXl2GU2QLD/T777//wkaj8W9ZHYzge7rJNIKZFV8g0VmRNcm+zsDWy3yShwZ/QQECGD+hzgPsUOXpnMvQP/JQp9N51TnnnHNnkelfaKC3Wq3NxphMj+bxJTonBCu7YHcZQE47T4fPxvTWFpn/le8bpDcWbybUwDnHzLosB++c29JsNnFqbCGvwgI9juPLReSreVBNp5/SwYP0Sajs8LTv27dv2cuuVTs/wyoLx04e4wttHksBetwh1eGcgwqP0CltdN9JOkH04xXW2huKSP9CAj2O498WkS/nRTAClJ5bqu2Q5thZxr3izLyihxz90R5yqvZ59TO0OxkF9EIMYCNzDmDHNldI+ZyuK6y1X8mp7bGbLRzQ2+32q51zXxx7RGM8CLUdNdSxhRTJMbi0DYcFgdJc70kftHttjG6ER3KggAY7+AWwn3766ctFOHVOPP0uXNDH1diMMa+JogjO48JchQJ63pKcVPdTWKHKQWWHbY4MONrrWnpr6U6VrzBcDB3pSwHyEA45SHXw/rTTTutmzuF3psj6arzW3sYkb6Eke2GAnqdN7jNKA53ZbpDmADvsOQDdD5sFR9yY070gj7EeAPgKxxykOrW0JF5nAHQ0URibvRBAz8O7Pmh+EbRMa8X2UwAd6ru/snMS0E7Xi0RB5nDohqKAVrfpVKPk5m3wyaxfv767oOuois604zyYNE+iKN74mQO9Fye/Y1qz1VfHMQngZfd3p02rP+E92VIgKXxK21vb41Dd4YEH6KHFacesniOTAh2j63Q6F806zj5ToPcy3r6VVTJM2ikD5tHTjk0Qe/fu7W6GoNMtONnSUrJ49w0COuPn4C/y32Gr46evtTGkOkGYzSfMQ8aYl8wyg25mQO+dWHprFmmto043ZkvhOVSMQborLhaaCEAflaLFuT8J6OidtscJ7Gc+85nL9eIp7XVMPUOgowvfF5FNs8qNnxnQW63WN7LcoJJ2qlFFg6cdHlfY5o8++ugxZ3ePG1ZJ24dwX34U6Ad0nbKMe6CuI6aOD5OlaKPTPs+6l9gI02w2fyPrdtO0NxOgT2uraRIB6EzDCo+kCYTUINXhfcelk2PSEDDcU2wKaHubEhqABtCx0QWlp1BFFqE3fW9WzjifOrPa4jp1oE+jaMSgqUf7HD+Rz45MOHjbtWqnjyQu9jQOveu3mPP7fs40AB0VaLjZRZ9FryV6Fs64hD5OvXjFVIHeK/+EnWgzu7CaI6zCM9AAdK3uBbV9ZqzJ9MXa1vYbBo9htkFl16e++BI9J5BTc3zVNMtSTQ3ovUKOKLKXS423tLMEzGPKK0CO4hI8r3zQ5Ejbfriv+BSg9x1aHNR3gJ171bUmkPOi/ziKmk6r4OQ0gf7dPKq1jjOtAGxuYIF9DuD7ec7jtBueKQcFGD5Db5ElB6AjB54HcuhwW8aed59A37PWvmAaVJsK0GfpfPOJyEwoZMNBouMngZ6XA2YajAzvOJ4CwyQyzDge2gjA69NZp0XPaTnncgd61ieoTMoArtCQ5MiGg62unW8hp31SCpfneW2nwymnT2ad5jyYxokwuQIdZ6EtLS39T5FYT+86SzljFQ9ALxKHptcXHueEdFiE2ViERNvpOavuy4Odm5v71TzPessV6K1W69tZHHiYJetZM4xAZ/EIqnnTXMmzHFdoa3QKgPfw1+BEVgBdAxy/D1P9R39j/ydwsGOz2XxRlm3qtnIDelZHF2c9cO5LBtD18cUB6FlTutjtcUcbNDzUkeMGF/SaGXLTBHqPWrkd2ZwL0Fut1hZjzC1FYzW3paK4BMJqPJyB6nyOec5FI0XoTw/Q4Dkccsh71yexzgDkXZ4457Y2m81MC6Ki3VyAHsfx3SKysWiziUBHaA1Ah8dd50AHoBeNY/n1RyfDAOiQ6EigwaXPvc8zaabP6HZaa38l65FnDvQ4jj8oIldn3dEs2iPQIckRWkMKLHesBdU9CwqXpw0NYMTQeXQTk2kwEpYPm8GorrPWvivL92YK9Ha7vck5h/3lhbwIdNjmADpPSO2pTAOP5ynkgEKnJqIAwY496VDduTddV5qZgUTvjqm3fx3buDO5MgV6HMc7RQRnlhfyAtB5SipUd2xmoV02K4YWklA16hT4DpUdQIdk1xJ9xhGYe6y1mZm/mQF91rvS0sxNAp057tia6AN9xsxNM4xwTwYUIJ9hj1OiA+i49L70DF41SROZ7XLLBOitVmuDMWbXJCOa9FnfS+r/rXPZsQcd9duZLMOKMtNKjph0rOH5bChA6Q2Jjjg60mD5XVEWfOfcQrPZ3D3piDMBehzHnxeR107amUmeTwt03Mdzz/1kmUneH54tHwXKAHQR+YK19nWTUndioLfb7UtRImfSjmTxvF6F+0l0gBtAR2iNx+fOKmaaxZhDG+NTgEDHpiZIdGTIFU2iY3QouRZF0U3jjzSDOHocx9hjftEkncjq2TRAZ/koxNLBVD9ZJqu+hHaKT4GyAF1E7rDWPn8Sik4k0dvt9lXOuesn6UCWzw4COrenwtMOia4Pa+itmsedzpJl30JbxaMAgQ6HLOLoKEKhq8EWKRJjjHlzFEWfHJeKEwE9juMfiMhzxn35NJ8j0CHJUfmVddzpgCuK82WaNAnveioLDkCH6o5dbPqQh4LR54fW2rGxNjbQyxBO04wC0AFmeNsBdKjwVNv9c88LxuDQnRwpQKDzOOUCAx1UGDvcNhbQ77vvvjVzc3M/FJF1OfIgk6bpaAOY8cGuNQKd+9BDWC0TUpeykZIB/cDS0tKzzz33XNSbG+kaC+hxHP+ViLxnpDfN4GatjhPoyIiDjQ4GA+j0vKN7tMkC8GfArBm9knvSobqjdhzmg97UMqNuDXrt+6y1I2NvZKD3jlL6kYisLiARjulSEtCRFQeJHoBedO5Np38EOk9toepe4JDrIRF51qhHO40D9L8UkfdOhw2jvSXJoaZVd7QGoPMcdNrtfC7sYBuN3mW+W6fAQrOjRNe57gUe33uste8bpX8jAX3nzp0rVqxYsUdEflF3Z5S35XxvGqBDmmP3GtJfCXR2K6juOTOogM1riQ7VvSRA33/06NEzNm7ceDQtSUcCehzH7xSR69I2Pu37AtCnTfHyv6+kQAfhr7bWfigtB0YF+mMicmraxqd9Xxqg81BF2ui6j0GiT5tjs39fPxt99j0b2oP91trUmnVqoMdxjMT6zw19/QxvGAZ0bmhhUUhWl/HBHrzuM2TilF+d5HUv0DbVYdR4vbUWG8qGXqMA/XYReeHQFmd4wyRA9x1yMxxGePUUKVCyOLpPme9Yay9OQ65UQG+32xej7nSaBmd5TwD6LKlfzneXKAU2kcA4NyGKIgjhgVcqoMdx/CkReeOwxmb9/zRAf/TRR7tpsFDPtOoect1nzb3ZvL/sQBeRT1tr3zSMekOB/sADD6xbXFzcn1dp6GEdHOX/4wK9wMkRoww/3DsGBSoAdDc/P3/q2WeffWDQ8IcCvdVqvc0Y89ExaDj1RwLQp07y0r+wAkBH7P/tzWbzY5MC/U5jzAVl5aifGbdv376BqnsIsZWV06P1W2fGocIMqsCiZpzevVYWTc85d1ez2bxwbKDv2rXrgk6nc+doJCzW3QQu7fF+QGevy8LcYlG5vL0BsAl0nMFW8G2qfQndaDQuXFhYuKvfDQNV9ziOkQWHbLjSXj7Q4YzrF0cP0ry0bB674wA267qffPLJpQU6MlYHne4yDOjYc37W2FQswIM+0JEZh00tvtdddzV44AvAuJy7QM0NPwF0lJIi0GG3szx4kcpJDSHJQ9baZ48s0Yt6Iuqo/B8GdDCUdd3ZdgD6qFQu3/0VBPrAk1j7SvR2u/2Pzrm3lI+Fx/a4H9CZ+pgE9LKPOfQ/HQUwN/DBSS2+REcLZUuFNsZ8IoqiP0gafV+gx3H8sIisT0ey4t6lgQ7GYZsq9qQHoBeXZ9PqGXPacWwy9qPjSCbfGVcmsBtjHo6i6MzUQC/6qaijTAQf6Lpm3Pz8fHfV9lX3UdoP95aXAuQ7bHNIdHjf8R0lfUml+kuiKDruFNZEiV4Fbzunnw90nI0OhxwOWETIjUDXTA0htvKCd5Sec6sy4ueQ6Fj4CXS0U9J58CFr7dU+HfoB/R4ROW8UohX1Xl0eChVlUNedQKdnVZ+HXWIGF5UFhewX5gWADimOo5gAdMwHXRiyRB53TeN7rbXHHV1+HNBbrdZ5xhgAvZIXQI2kmSNHjixXfeXhDjqOXlImV5JnkwyKYVRqblpKo7Y/1HaepIryYnrRL2v0xTl3frPZvFfTLQnopcltH2cCgHlImoEKz3gpgT5Oe+GZYlNAa3S0vQl68B3SHLXiEEsH8KtwJeW+Hwf0OI5vEJHfrMKAj7NTjOna5fC8wymn7fSQFVctjg/jJ6U5QI7UV4AfEp1e9rJK8x4X/9Nae/lAiR7HMU6BKHzN9nGmJZiHc7aQAosQG9R35sD7anuZwirj0KIOz2g1Xf8O9RygZolnSHNod1TbqeGVOBpzyFq7pi/Qy1JJZpJJCs8qDlgE0FGAQgN9mBSY5L3h2elRwC8L5gOeJtvpp5/eVd0xB6i200GL3pYY6NBMjqk8c4zqXraDE8eZOjxQEUcz4cMQS6gZNw41i/mMVrt9G52SGyE1nM6CrDhcnAcVcsIecyCjD/SvicjLism+bHqFSQCw81RVqO+Q8jxwsaSx02yIU5FWaHZp5xsdcDxrD/vPYZvz/D3c60dfSk6Or1trX84x+EA/IiJPLXEVvsBcABwOOdjrmARJpZ8rTILKD41g1+o3bXBIcajtiKED4LxHa3UgUMn9NE9Ya1cdB/Q4jhFk31n5GSDSXbmhqh06dKjrgU86nqkOdKjiGHVKs5/erDPhTjvttO7wmQlXclD3Y+VGa203J2ZZorfb7d9zzn22iszXY6JqDgmO8Bpi6gA8Lv/QxarToorj4yKusx7xHY9DRtSF3nbtaac0r0h4rctaY8wboij652OA3mq1PmaM+eMqMt8fE8AOuxwXEmf27NnTnQj4jpOioit8Hdi7nKPOlFb6XwBsFpmAfY6LdjwFgHbGlTyWjrH9XbPZfNsxQI/jGAc0pDr1ocyzRa/cVO2Q+w7AQ4XHpKBnvszjrGvfuVBz/HS+0Q7HllSo7diSSonOOcE8dzrl8HfJsyZvt9Ze4gP9sIgsG+9Vniga7JDi2OiCUBt+cp96lcdf5bH5QPcBz73n+B6mGyQ41Hk46OiYqxDQj1hrT1oGervdjpxzcZUngD822nBkKux0eOEBdtrrdaJHVcbqq9u+9x2qO8AOkCNxChdAznx3vU21CjQxxtgoitpdZ1wcx8iL/WoVBjZsDEkTASs6VnOo7wi36Z1tw9oL/y8WBaiqs1c6pt6VbMYs57VTdQf/AXQk0FAjwHxgjL1YIxy5N6+w1t7QBfquXbve3el0rh25iRI+4CdGYGIg/RErPGx0/H748OHlLawlHGKtu9zPqaaJwhRYAJlbUyHpYbtD2tOJVwWHbKPRuGZhYeEDXaC32+3POOfeUIcZwv3JOpYOlR1qHLPmKuCEqQMrB45R71vwtTja4vTGUwtAOSnmvmMOVCFL0hjz2SiKriTQb3POVd7jzplBuxwqOja3wD6npOf/qrCa1xHtOruNajrokJQOS/pwUVi3bl1XhYeDlt+VPffdGHN7FEWXEOh7nHNn1GFikPlQ0ZnvjnGzflyS6lcHulRtjEkLtb87UcfQIdUBdNjpsNl1WK7MtGFlWLNnz56TDh8+/LOyr1yjMIMhNaS/wvnGHUykQYijj0LNYt2rd6uhZ7qKkJbq+j7cA1sd0hybXTA/IAi0RlCsUabvDcZw0kknnWx+8IMfnLe4uHhPnYAO6Q1pDrX9iSeeWJbm2lNbJ3qknzbVulMnyoDfvkSvwmgxxvn5+fPN7t27t3Q6nVvqNLEhsRFK00APUrwK03q0MRDoPLQBQNdln0drrZh39xzMW0273Ya3HV73YvY0h15xPzqy4SDReZBDnWiQA1lL26QPdNjoTIct7aB6He/5Kq40iKE7566t0yTH4CHRAXQWntCJFcHjXvbpPbz/OnSG32GjwxFHiV6h8Bp8DdcA6B92zr2jLkCng4Wquwa675UdPl3CHWWlgA90ABsgB9jhw6kY0D8CoP8/59zr6wJ07jmnREduu1bduRDUhR5lBWqW/WYCDTzusNN1GmyW75lFW735/DkA/RvOucvqMrGZ/cYdawA8gR687rOYirN9J0NukOKsI1dBoN8Ir/t3Op3OC+oCdEwrABsqO2x0pL/6QJ/t1AtvnyYFWEcO9eNQRw457zq7bpp9yeNdPcH2XUj0u51zG+sGdOS2s+Qzq83kQejQZrEpQKCjEMX69esrlf4KyvdU950A+g+cc8+pG9CxWw3SHLF02u3FnpKhd3lQgJlzKC0FoOsNMFXARA/oDwLojnZKHoQsWps6jAY7HcUh9W614HkvGsfy6Q8BzfJh8Lbjo8Fd5pNatL+pC/a6AZ3qDH4iWQZA5xlsZH6Io+cDriK1yvAaS4dhiyo87kyeQV91CK5IfR+lL4wi1Q7oZB7Udajv3NjC3WshvDbKNCrvvZTWmA+sDIuz0hlqqwLIlY1eP4lOBrK6CGx0gJ3VX8s7dUPPR6GAVtHhiENojSe3VME2D6p7jwKMlWIX2759+45xyFVlNR9l4tftXmhu9M3AEQega0ccpWHZQV9b1Z3M5G41OOQA9Co4XuoG1knGS9MNoVXY5rDR9UYWH/STvGuWz9YW6HSyMKSGeDoccnDMYfXm92VfyWc5ucrwbgAAxSVQdATedoAdHnjN9ypodrUGOtUyFoiEnY5KM/5Z6WWYsKGP41GAiTI4Jx2VZWCna487WvVLR4/3ptk+VVug6xCa3smGY5nghde142bLovD2PCkA6c167qeccsry0UtcAEJ4LU/qT6Ft2uZUy2CjQW3fu3dvN54esuSmwIQZvwK8h9qOcBq2psIZx6Ozq+ar0RK9dimwep4B2JDijzzySLeOXDgrfcYonPD12puO36l++z4X+GZ4OgsPXGSGKMFRhfr+OgW2dptadIwRv0OqQ3VH7jvU97DJZUK0zfBxgptgTQI6AI0FndlwiJ/jb62u63ZmOJyJX728qaWO21STgA6HHGvIwXYLV3kpQLMsKUTGzDd//zk3t+hRV8Xr3mg0uttUa1V4wl+18TeYDtQC0BsAABpaSURBVK87wA47PQC9vCAf1nOAF6DmOelIf+UJqn76c1WAboy5sXalpHygg5n6QAcczxQKUQyDS7H/PyjZhXY47HN8WB+OG5mqkiijtVZjTLeUVK2KQ/YDOjzvkOhwyIHZPIOt2FM69C6JAsOADt6imgy87riYP5Gkvpedwj0tpVscsnblnn3mgfFwxsAZhw9PXC07k0P/j6UAVXGo66wmw7g5k6fwRJW2KfeAfk0tD3DwAUAJAGkOh1zwvFdziaAHHtlwOAtdF1ypmsruOZyvrOWRTGSq9s7iO5aAPnz4cLDTS4p1n7d6GCwyAdsciTK6dntSGK4K4O+ZoVtreciingzMlINTBjvZYKcD8PC8V0mFKyluR+72IHAC2OAr4udIe2XsnEk2mAM6saYqQO8esljHY5P17CEzwWSkRcJGRzosdjUR6H5clpMhLAQj4zDXB5L4xZpwDKEhCw5qe12SokCT7rHJoHy73d7jnDsjVy4UtHECnYUoIM2xP51bVv3c+KRFoqBDq2W3mNGmnWpaYsM+R5EJvXmlyoQyxjwcRdGZBPptzrmLqzzgfgAl0PmT9d6RQKNDbAy5BSlejlmi7W863ZAkw73n0N7qUHPAGHN7FEWXEOg4NhnHJ9fi0raX/zsmCGx11JHjZAFRmESjs6iqkDlVJYaTH7DDwSfa4NycAruce89rBPTPRlF0ZRfoiKV3Op1rq8T0QWMZBHQ8h0mAVFiE2eiNxeTB98icwwTqxSfrQrJCjHOQb4RSG3wCoLEwA+DgH/iGvyHR4XvBVQdpjnE2Go1rFhYWPtAFehzHl4vIVwvBzSl0IikEox1uPQItlxbCJMEOJ3jkUXYKEycUqJgCo7xX+EDXGhU3q4BPSIbRWW9crOmH4Vbk6Y9gJm98hbX2BqrukXMunkk3ZvjSfqo3FgLmQFNtx9/YygqgY6LUxWs7Q/Yc8+pBizNuZBkoSGykt0J6E/xcuHlfXaQ5xmuMsVEUtbtA70n1wyKyqiiMnXU/tLedxSkg0QF2Jl7UacLMmh9pgA6+wKuOOLnelUag68ISsx7PlN5/xFp7UhfwCui3iUitPO/DbDVty3MrK5x0jM0GoE9puvbyzzVQGUZjFAQSHUCHVx1Zb3pXms+nGkVObrfWXnIM0Fut1seMMX88PdbN9k06ucK3zzmhmCmFe6Gq87AHOOlCbbnp8s/PUksCOsCOGDnAzo1KtMt7amy301WrC9ePE865v2s2m287Bujtdvv3nHOfnS77ivs27mbS3nVIjIcffnj5UEZOHj9t0tcUqpBKOWtO+f4UJjRxaynzHM4444yu2s7L1wKGaXGzHmeW7zfGvCGKon/2VffzRWRnli+qSls6qQZZcwixUSr4aqDWFDj+APTJZ0IS0ElX8gIOOHjcqYn1M61qlP+w0Vp7zzFAxx9xHB8RkacCjTW/kiYDJhAccn4RSR32SQJ6zUmZyfApwSmh6SxF4/SZcFca1fOkF9cI5E9Ya5ed68vOuB7QvyYiL8uEMyVvJGlCIBkDqbFwyCGhhqdv+kMNEjx75vtAh8+EiUvclYawGmq0M9SW5HvJvmeFbfHr1tqXL2uVuptxHL9bRGqTIZeGRZTWkCCsLYcQG9T3APQ0FMzmHoKWP+lDYTIMEmSwK41qu05VTioLVoOIyTXW2g8kAr3dbl/snEOYrfaXH7dlEg087jyrDZOFGXIkWA0m0EznhpbSDKlh6ykOScRH709AR+tqVhljLomi6PZEoPfU98dFZPVMuVmQl+tJRdURXWMlGkh1eHi1Qy4APV/maZOK9vratWu7ITXwAunJjJTw/+iRz6OKx9IPWWvXaE4cY6P3gH6DiPxmvuwqV+t+4gykOhxysNUh0akaBtt8enwFiCHRAW444QB20N/fcMR95zUD+n9aa7F/Zfk6DuitVuttxpiPTo9l5XiTtg3xO+rKIdRGCRLOVZ8eH6k1AdRQ17n11Ffbp9ejYr3JOff2ZrP5sWFAP88Y04291fnSNrqv+gHUADhDbbTfg0TPd8ZonlCiwwHHbangiV8RqI55Dc6585vN5r0Dgd5T3wH08/JlWzla1za3TnuF9MChD8iUYx14TCoeBoDR+fZkOUZczF4y5ZVAhvmEnHZIc0Q/qKIHH4nca61F8tsx13Gqew/o14nIO4vJ8tn2ihKCoMZxy1DjdZxX24MhgSYbfmlpzkw4ZMEhbs589gDyLq0/ZK29OhXQ2+32Jufct7JhUflb8cHKvGqMDBtdoMJDujPW7h/tE1T6bOYAnW1oDSE1AJ25DHUp9jiMksaYl0RRdGsqoOOmOleGPY5IxnQ9unoyAdTcIQWnHEJukCg8a9uX6kHaDJuiw/9PoIPuCKfhQxMp0LdLir3W2sRqzomqew/o/+ice8tw8lf3Dm1j93PqIFuOZ6ujgiwLE1Y8TjsTpjMuDmmO7aj4Cc+7nzU3k84V4KXGmE9EUfQHSV3pC/RWq7XFGHNLAfpfqC74nl9IcH0Sq79PXS8WhRpICTsDULP4I6rIgLYwk3CRL3VeYJ1zW5vN5vaRgI6b4zj+oYicVcI5MXGX/aw4P5WS0oVZWNjs4h/QqJ+ZuEM1bwC0RPgMOe3wtiNBRktzkKcuBSX6TIWHrLXP7jdN+kr0HtA/KCLHefDqOOf65Uzje0gZntuGtFgWjgxAz26mcJMKYuZMd2UWHN9Sczs90dtO2gwE+q5duy7odDp3ZseuarVEdRHAhn2OtFhIdV99D173yfkOUMNMAsgBdg3qmgO8S9xGo3HhwsLCXWNJdDzUarXuNMZcMDmrytWCtsWpnmMEnFQ6JRbfw1aE5x1bWBlTX15NjanNgQF5cBn0BNBR4RVqO9R31u2jyt6b7LWks3PurmazeeEg2g+U6D2gh9z3FLMXUhxSHQk0KErB8FuQ5oOJpxON/ExCOtaYl4B0VyTI+KWieF9dbfSk3Haf6kOB/sADD6xbXFzcr0tDp5j3tbuF+e+Q6JDsTKoJQB8+FXztST9BzzoOZkBIjQczULsKUQ1x8/Pzp5599tkHJpLoPafcp0TkjcNZVt87WPEENjpsdV99ry9lJhs5y0LBLofazrx2HTuvudPz09baNw2j8lCJjgZC5ZlhZOw6Q7rhHXjfcWxT0j7o4a2EOyipKeWpjiNuDrDzYAaAG7/TG19XG92vJNNvBqUCek+qoyzNC8NUTKYA7UTY6djRxiN7tSMv0O54CiQ5PQlughhRDdRrRyYcLibJsOCHlug188B/x1qb6nSlUYD+OhH5XJisg4GOSbhnz56uYw5XAPrgGTMM6Hga9jmADglOie+3WlNfyOuttZ9Pg8nUQO9J9cdE5KmdBOE6jgKcbJDoeutqndMy004TnYmoJTqkNsJq8LgzG7FfmzVzzO231j49LX1HBTr2qGOvergSKEBAI8TG3WyUQoFg6SigJTPrtSNJBgUmWCpK39MvJJfubaW+62pr7YfSjmAkoO/cuXPFihUrHg5S/Rfk1RONQEeIDbnvrDyTlhl1vU8D1wc6ij/iYAYkyTC3neq73lFYM63psaNHj565cePGo2nnzEhA76nvfyki7037gqrf5wMdEw7VYRFmI9BrplKOzPJ+QAf9aJ8D8D7Qa+yMe4+19n2jEHocoK8VkR+F2u+/ILPeIonJR6Dr+nGjMKWu9/pqOOiABBmE1lhJRu8arCmdDonIs6y1B0cZ/8hA70l1SHRI9nB5e6Fhk0N1h0QPQB9/ejBM5gM95CfIe621fzUqZccC+n333bdmbm4Oe9XXjfrCKt6vJTqATonOUz6rOOa8x8Qz1Qh0bAUG+GsO9ANHjx49a+PGjZDqI11jAb0n1cOBjD1S+0BHaSl8AtBHmovdm0FLJsrADIITDqo7kmYC0OWYgxNHoe7YQO+B/UER6VvVYpSOlPleAp071qC2A+ioiBLCa8M56zvjfKBjM4s+JZULwvCWK3XHg9baXx53RBMBvd1uX+Wcu37cl1ftOQIdoTXY6QHo6TgcgD6cTsaYN0dR9MnhdybfMRHQe1L9eyJy0bgdqNJzBDoLUOjiCFUaZ55jCap7InXvsNY+fxK6Twz0drt9qXPuxkk6UZVnCXTUjcMOtgD08TkbnHG/oJ0x5rIoim4an5oiEwO9J9WRWP/aSTpShWcJdG5VxcYWJnVUYXzTHEMIry1T+wvWWmwom+jKBOitVmuDMWbXRD2pwMMB6JMxcVDCDDLjWIQCb6lLyqtzbqHZbO6ejLIZSfSeVK99uI3VX6G6I5aOgx0wIekxnpRZVX3e36TCE1MBbAAcO9eY606VHrTQVWYqSpuxw2k+PTKR6Gw0juOdInLcka0VZUJ3WHp7JSYsJimccRroQX0fPAP05hQt1ZFZiNRXxNFxYIO/e63iewjusdZuzAo7mQK9jqewUsKwwARAjfAa4uhwxnES10XVHHdi6gIUbAO0RaLMunXruvXidMKMXmTHfWeRn+t3Kuq4fc4U6D0Vvlanu/hFIAF0FIdkZhzV0AD0dFNUl4LiIgq1HVtVSUveU2GJfp219l3pKJbursyB3gP73SKSmdqRbiizu4sTED3A7zxdFSmwTN2cXe/K82a/rBQz5GCno5QU1HhK8grvYttprf2VrLmWC9DrdBIrVXZKmaRtqtrZlDUDq9Ce9nNoiU5VHc7M9evXd7esstqu74yrSsnnQSeiTsLrXIDek+p/IyLXTNK5sjyrc93xO5JlYKeHbaqjcVBvDiJwKdWR785yz9zBpr3uFVHjr7XW/tloVEt3d25Ax+tbrda3UXc6XVfKfxdVeNSMQ4hNO+rKP7rpjUBrQIydo24cPjCFeESTlv7T610+b3LO3dZsNl+UT+sZxtGTOrh79+7nLi0t/U9enS9Su1ThYZfv3bu3G0NPqidXpD4XsS+gGQ9moHoOmsLzjjAb9qUT6P5Za2U2kebm5n51w4YN/5sXT3KV6Oh0u93+fefc2Ltu8hp41u0yVg6A8wAHgj/rd1WtPT9hhqexEOgANuLoUN8BdALcl+jafi8TjYwxV0VR9E959jl3oPfA/gnn3JvzHEjWbSelYyYVI8QkxXZUTEBc8Ljv27evK5UGHTiQdX/L2l6SFGYokvY5eAFHHDLk9Nlr+ngmJiuVTZ03xlwfRdFb8ubfVICOQcRx/F0RmWirXd7E0O1TOgzz5mqpDWmOjDjY50yHRZs6/DbNMZThXYOATq87fjJDDjF1PAMprzMOSxpu+5619gXT4NM0gY7UWOxdXzONgU36jqQJSJWRE4zeX0xCSPWDBw8elyhDoE/an7o+TwDjJ7LjYKuD3sg61LT17fUS0OtxCD5r7T3T6OvUgI7BtFqtVxpj/m0aA5v0HTq2S1vR96JzcsETfOTIkW7lV4CdauSkfQjPP7WXABeAzVRYqPFw0FGq8x7txCs67Zxzr2o2m/8+rX5OFeg9Fb4Uu9wYA9fZWn4KJv6GbQ6VHXFzgBySnWo7JT+9xNNiahXfA2AjQw5gh2MOiytorTfElMhEymxXWlpeTx3o6Fi73S6Nc07b6JhIAC1PYIEKie/gfIM0h9SBVPGddmmZEe5LpgAXW4CdVWGRPIPCHviOdQDKsKBOy/nmU3ImQO+p8d9AiZyiTm4/5MN+clLh/wA8pDikOePmALq/7bJEkqaQ7CCteegiJDrsdSbP9Au3FW0wKLnWbDZ/Yxb9mhnQ4zjG0U63isjzZjHwtO/UoR48g8mF7yBJcDQy0l3xux8z9zdopH1fuK8/BeiYAw8g0aHG0y4vQVjt+yKyadSjlLKaDzMDek+Fj5xz3xKRs7IaUFbt+M44tEvQQ0UHyBFGQ5EJSGxMPh2S471Z9Se08xT9IdVZkAJHKa9evXp58QWNGAkpGL0e6u0vb8+qXzMFOgZ9//33X9hoNO6YFQGGvZeApyQHwKGqA+AAPLdOoh0/ySaAfRh1nwKvlsaaZvyekpwJSAAza+ZDqkO6r1q1alnTIi+Gv306d3Q6nYvOOeecO6fztuS3zBzoPXt9szFm+yiE8EHkx1GHhcd0ggVtaEoDqoPMbsO9cPzAHgfA8TtzsgOYR+Ha+Pf6CwKTadAivPFw0uHDraz8Px10vs8lLd+S8in8UQzaOeec29JsNneMP/JsniwE0DGUOI4vF5GvjjssfwNJUqZUEtO0V512Nn8C+FTTUcIZDjf/kL+0E2bccYXnnqKA7/Pg3wAyLizKCHVClYd0B/ihhVGdZzot29IO0yQaD8uI5DNDFoJXWGtvKAIPCwP0Hth/W0S+PA5h9EQgM/12/Hv0/3VYDM41ABySG4kwADhURS4mOr21BE6gcchZuGf6qfg6H56AX7lyZRfs+AnTimaXzrJLksp63gxbCDTQ8XvCPLjCWvuVohCyUEAHUdrt9qudc18clUBJQO8nwbXk1kwCswBygBuONoAbf+vUV7appf6ofQ33j0cBH3zaPCOIGVcHuCHhAXao9JDwSZuMtB+A7Sf5Cfr1OGlBMMa8JoqiL403ynyeKhzQ00p2X2XWtpgGoa+aM9mFqzyeg+TGB5IbHwCdGW6Mi7NNzYYgzfOZlEmt+unHtMHBF61hUVXnAo2/Id1hu+MDwGMB8G12n6/krd444wuFPppjoST5suYxPVaN9qZxbXYt2bWqTYbR8QbVHICGFx2/A9isG04GcgJplc/fMRVs9NH4Ou7dSc40/zvySfONPMV3tOMBdoTmmNmo7X3a/LqNfn1OiBYUxib3+1xIic5Otlqtgd54TWidfUbwkVkMx1AVx2pPKe7nS+PdPsC1NNdx2pDxNi5sR3/Oj4xQkvtalXbKEviUxFrVB9gBdKj2tOX1XgbfmZvkWfcWmkJ41/uaGKOTfLpP9OLs2PE2MKnGV63JKACZajkkN0BOtY+OHH/1HiSlB4VSpkuZer+tj218DFG02cb54C/UMOEAeqj1UPGh1vvbkIfY8Q8tLS29atZx8mGzodASnZ1vt9vIoINz43kaaEngBiOhfgHgADZsbvzEh2oZpYFvf/F9vgpIuw/fJ0n7YUQO/5+cAr6vxbeX9eLsO2b1JiPOHy725CkADqDTW0/Aoy3t2ddagYggrfXVURTNLOMtLWVLAXQMBrnxzrl/5UYYMo9MpTpOhxrtbp0EoxmuFwntyCOoeTCix9jlMEqQ7GmnWDb3JXnc6UvRbximYvMZRlL0/MF3kPCQ7ky+gbTXqr9acG50zv3OrHLXR6VqaYDOge3atesTjUbjzSA41XKo5nSqcRspbe1+UntUQoX7q00B7XClEMBij51yAD0kPWvULS4uXt9sNnOv85YlxUsHdAz+7rvvfveRI0eupVpO1UrbX0nhMO08yZKIoa1qUEA777S2AKcdpfyqVauuWVhY+EDZRlxKoIPI27dvf+Xi4uJnnHNrtNQmwKnq6ZTVAPSyTc/p99f34lPFn5ube/zEE0+88sUvfvHUyj9lOfrSAh1EuPHGG8+fm5v7VKPReL4PaBJJh0kC0LOcOvVoqwf87y0tLb3psssum0ohxzwoW2qgkyA7duzolqbyV+M8CBbarC4F/LBqT0hcv23btlLZ40kcqgTQe6r88okwfigmKQ5a3ekaRpYVBXCCypYtW3I9QSWrvg5rpzJAx0B37Njx3E6n8/cikniwYwiJDZsO4f89Cty2tLT0R5deemluZ6FNm9KVAjqJd8sttyQe2RyAPu3pVcr3Xbt169Zcji6eJTUqCXQQ9Oabb95ijPmwiGzUjrmwCWWW063Q797pnPuTbdu2jVTpqNAjUp2rLNCVo+6Dzrmr8Xdw1pVlWk69n9dt3br1XVN/6xRfWHmgg5bf/OY3NzUajY+LCM5/C1egAClwT6fTeetLX/pSlB2v9FULoJOD27dvf7dz7tpKczQMLhUFjDHXbNmypXQZbqkGl3BTrYCO8e/YsWPD0tLSXxtjXjsu0cJz5aWAc+4Lc3Nzf7F58+bd5R3F6D2vHdBJoptvvvlSY8x7ROSi0ckWnighBe5wzr1327ZtN5Ww7xN3ubZAV4C/yhiDcMpzJqZmaKCIFPihc+7927Zt+2QROzetPtUe6J79/qcism5axA/vyZUCB4wxf1snO3wQNQPQFXVuuOGGNStXrrzaGINw3Opcp2FoPC8KHBKRDx05cuSDl19++eN5vaRs7QagJ3DsxhtvXDs/P/8OEXmbiDy9bEytaX/3i8hHFxcXP3LZZZcdrCkN+g47AH3AjPjyl7+8Yt26dW8VkT8XkVPD5CkkBQDw9x84cODjV1xxxdFC9rAAnQpAT8mEm2+++XXGmD8UkRemfCTcli8FvuOc+4dt27Z9Pt/XVKP1APQR+XjLLbdcbIx5o3PuSpz9N+Lj4fbJKOCMMagq9OmtW7fePllT9Xo6TNQx+X3rrbeuO3r06O8aY14vIheM2Ux4LB0F7nLOfW7FihX/smnTpgPpHgl3aQoEoGcwH3bs2HFBp9N5jYjgNNiBB01k8Lq6NPEQTtZtNBpf2rx58111GXRe4wxAz5iyve2xv+Wce4UxZn3GzVe9uYdF5Abn3H9UdbvorBgYgJ4j5Xu75l4mIpeKyHk5vqrMTd8rIjd1Op2v12EX2awYFYA+Jcpv3779vE6ng2IYvy4iL6lxQg4SWr7lnPuvRqOxfcuWLQB6uHKmQAB6zgTu13zPe/8iEbnYObdZRFbOqCt5v/YJY8wOEbndOfft4C3Pm9zJ7Qegz4bux711x44d5y8tLcF7/2vGmOfhQEkRWVWQ7qXtxhEcPOicw+GD/z03N3fX5s2bS1sLPe2gy3BfAHqBuXTrrbdGi4uLqHl3njHmHGOMdc5tEJEzZtzth40xu51zsXPufhG5d35+fuemTZsKf6rojOk2s9cHoM+M9OO/+Gtf+9pJa9eufc6TTz75S3Nzc8/qdDrrG43G6Z1O5xnGmFONMU9zzq3t+QHSbr99UEQOGWMOOud+4pzb32g0ftzpdB5pNBp7l5aWfnTCCSf838GDBx98+ctffnj83ocnZ0GB/w9zp07KUafVbwAAAABJRU5ErkJggg=="
    }else{
       imgData = req.body.profile;
    }
    
   
    var base64Data = imgData.replace(/^data:image\/png;base64,/, "");
    var nTimestamp = Date.now();
    

    require("fs").writeFile("./static/img/" + req.body.id + "/" + req.body.id + "-" + nTimestamp + ".jpg", base64Data, 'base64',
        function (err, data) {
            if (err) {
                console.log('err', err);
            }
        });


    try {
        _members.update({
            name: req.body.name,
            role_id: req.body.role_id,
            profile: req.body.id + '-' + nTimestamp + '.jpg'
        },
            {
                where: {
                    id: req.body.id
                }
            })
            .then(result => {
                _members.count()
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
                            .then(members => {
                                let records = [];
                                for (i = 0; i < members.length; i++) {
                                    records.push({
                                        row_number: (offset + 1) + i,
                                        id: members[i].id,
                                        name: members[i].name,
                                        email: members[i].email,
                                        role_id: members[i].role_id,
                                        rolename: members[i].tblroles[0].rolename,
                                        status: members[i].status
                                    });
                                }
                                res.send({
                                    members: records,
                                    pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                                })
                            });
                    });

            });
    } catch (err) {
        return next(err);
    }
});

router.post('/admin/member/edit', ensureAuthenticated, (req, res) => {
    _members.hasMany(_roles, { sourceKey: 'role_id', foreignKey: 'role_id' });
    _members.findAll({
        attributes: [
            ['id', 'id'],
            ['email', 'email'],
            ['name', 'name'],
            ['status', 'status'],
            ['profile', 'profile']
        ],
        include: [{
            model: _roles,
            required: true,
            attributes: [
                ['role_id', 'role_id'],
                ['rolename', 'rolename'],
            ]
        }],
        order: [
            ['id', 'DESC']
        ],
        where: {
            id: req.body.id
        },

    })
        .then(result => {
            res.send({ members: result });

        });
});



// Reset Password
router.post('/admin/members/memberresetpassword', (req, res) => {
    console.log(req.body);
    let data = {
        password: req.body.password,
        id: req.body.id
    }
    try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(data.password, salt, (err, hash) => {
                if (err) throw err;
                data.password = hash;
                _members.update({
                    password: data.password
                }, {
                    where: {
                        id: req.body.id
                    }
                }
                )
                    .then(result => {
                        res.send({ status: 1 });
                    });
            });
        });
    } catch (err) {
        return next(err);
    }
});


//start of search
router.post('/admin/member/search', (req, res) => {
    _members.hasMany(_roles, { sourceKey: 'role_id', foreignKey: 'role_id' });
    const MemberData = {
        searchkey: req.body.searchkey,
        searchfield: req.body.searchfield,
        page: req.body.page
    }

    var field = MemberData.searchfield;
    var field = field.toLowerCase();
    var whereStatement = {};
    var whereStatement1 = {};

    if (field === "name") {
        whereStatement.name = { [Op.like]: '%' + MemberData.searchkey + '%' };
    }
    if (field === "email") {
        whereStatement.email = { [Op.like]: '%' + MemberData.searchkey + '%' };
    }
    if (field === "status") {
        whereStatement.status = { [Op.eq]: '' + MemberData.searchkey + '' };
    }
    if (field === "rolename") {
        whereStatement1.rolename = { [Op.like]: '%' + MemberData.searchkey + '%' };
    }
    if (field === "") {
        whereStatement.name = { [Op.like]: '%%' };
    }

    try {
        _members.count({
            include: [{
                model: _roles,
                required: true,
                where: whereStatement1
            }],
            where: whereStatement
        })
            .then(cnt => {
                
                let page = MemberData.page || 1;
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
                _members.findAll({
                    include: [{
                        model: _roles,
                        required: true,
                        attributes: [
                            ['rolename', 'rolename'],
                        ],
                        where: whereStatement1
                    }],
                    order: [
                        ['id', 'DESC']
                    ],
                    where: whereStatement,
                    limit: limit,
                    offset: offset

                }).then(members => {
                    let records = [];
                    for (i = 0; i < members.length; i++) {
                        records.push({
                            row_number: (offset + 1) + i,
                            id: members[i].id,
                            name: members[i].name,
                            email: members[i].email,
                            role_id: members[i].role_id,
                            rolename: members[i].tblroles[0].rolename,
                            status: members[i].status
                        });
                    }
                    
                    res.send({
                        members: records,
                        pagination: { page: page, pageCount: totalpage, totalrecord: cnt, off: offset + 1, bong: b }
                    })
                });
            });
    } catch (err) {
        return next(err);
    }
});
// end of search
router.post('/admin/member/roleonoff', (req, res) => {
    let status;
    if (req.body.value == 'on') {
        status = '1'
    } else {
        status = '0'
    }
    try {
        _members.update({
            status: status
        }, {
            where: {
                id: req.body.id
            }
        })
            .then(result => {
                res.send({ status: "OK" });
            });
    } catch (err) {
        return next(err);
    }
});
module.exports = router;