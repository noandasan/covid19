function includeJs(jsFilePath) {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = jsFilePath;
    document.body.appendChild(js);
}

includeJs("/js/myjs/bootstrap-select.js");
includeJs("/js/myjs/toastr.js");

includeJs("/js/myjs/main.js");
includeJs("/js/myjs/roles.js");
includeJs("/js/myjs/members.js");
includeJs("/js/myjs/countries.js");
includeJs("/js/myjs/functions.js");
