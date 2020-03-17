module.exports = {
    Control: function(tb1, tb2, tb3){
        const _controlassignments = tb1;
        const _modules = tb2; 
        const _controls = tb2; 
        try {

         } catch (err) {
            return next(err);
        } 


    },
    Menu: function(roleid, tb1, tb2) {

        const _roleassigments = tb1;
        const _modules = tb2;

        let parent_temp = [];
        let child_temp = [];
        let parent = [];
        let child = [];

       try {
            _roleassigments.hasMany(_modules, { sourceKey: 'module_id', foreignKey:'module_id'});
            _roleassigments.findAll({
                
                    include: [{
                        model: _modules,
                        required: true,
                        attributes: [
                            ['modulename', 'modulename'],
                            ['path', 'path'],
                            ['parent', 'parent'],
                            ['module_id', 'module_id'],
                            ['icon', 'icon']
                        ]
                    }],
                    attributes: [
                        ['id', 'id']                   
                    ],
                    where: { role_id: roleid },
                    order: [
                        [ {model: _modules},'position', 'ASC']
                    ]
                })
                .then(roles => {
                    var a=(JSON.parse(JSON.stringify(roles)));
                    
                    for (i = 0; i < a.length; i++) {
                        if (roles[i].tblmodules[0].parent == 0) {
                            parent_temp.push({ module_id: roles[i].tblmodules[0].module_id,
                                               modulename: roles[i].tblmodules[0].modulename,
                                               path: roles[i].tblmodules[0].path,
                                               parent: roles[i].tblmodules[0].parent,
                                               icon: roles[i].tblmodules[0].icon });
                        } else {
                            child_temp.push({ module_id: roles[i].tblmodules[0].module_id,
                                modulename: roles[i].tblmodules[0].modulename,
                                path: roles[i].tblmodules[0].path,
                                parent: roles[i].tblmodules[0].parent,
                                icon: roles[i].tblmodules[0].icon });
                        }
                    }
                 
                    for (c = 0; c < parent_temp.length; c++) {
                        child = [];
                        for (d = 0; d < child_temp.length; d++) {
                            if (parent_temp[c].module_id == child_temp[d].parent) {
                                child.push({ module_id: parent_temp[c].module_id,
                                             modulename: child_temp[d].modulename, 
                                             path: child_temp[d].path, 
                                             icon: child_temp[d].icon });
                            }
                        }
                        parent.push({ module_id: parent_temp[c].module_id,
                                      modulename: parent_temp[c].modulename, 
                                      path: parent_temp[c].path, 
                                      icon: parent_temp[c].icon, child: child });
                    }

                });
            return parent;

        } catch (err) {
            return next(err);
        }
    },
    Module: function(tb2) {

        const _modules = tb2;

        let parent_temp = [];
        let child_temp = [];
        let parent = [];
        let child = [];
        try {

            _modules.findAll({
                    attributes: [
                        ['modulename', 'modulename'],
                        ['path', 'path'],
                        ['parent', 'parent'],
                        ['module_id', 'module_id'],
                        ['icon', 'icon']
                    ],
                    order: [
                        ['position', 'ASC']
                    ]
                })
                .then(roles => {

                    for (i = 0; i < roles.length; i++) {
                        if (roles[i].parent == 0) {
                            parent_temp.push({ module_id: roles[i].module_id, modulename: roles[i].modulename, path: roles[i].path, parent: roles[i].parent, icon: roles[i].icon });
                        } else {
                            child_temp.push({ module_id: roles[i].module_id, modulename: roles[i].modulename, path: roles[i].path, parent: roles[i].parent, icon: roles[i].icon });
                        }
                    }
                    for (c = 0; c < parent_temp.length; c++) {
                        child = [];
                        for (d = 0; d < child_temp.length; d++) {
                            if (parent_temp[c].module_id == child_temp[d].parent) {
                                child.push({ modulename: child_temp[d].modulename, path: child_temp[d].path, icon: child_temp[d].icon });
                            }
                        }
                        parent.push({ modulename: parent_temp[c].modulename, path: parent_temp[c].path, icon: parent_temp[c].icon, child: child });
                    }

                });
            return parent;
        } catch (err) {
            return next(err);
        }
    }

}