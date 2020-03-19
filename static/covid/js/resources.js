function includeJs(jsFilePath) {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = jsFilePath;
    document.body.appendChild(js);
}

includeJs("/covid/js/myjs/toastr.js");
includeJs("/covid/js/myjs/main.js");
includeJs("/covid/js/myjs/front.js");
includeJs("/covid/js/myjs/moment.js");
includeJs("/covid/js/myjs/functions.js");
