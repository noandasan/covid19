module.exports = {
    if_equal: function (a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    },
    for_loop: function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i <= to; i += incr)
            accum += block.fn(i);
        return accum;
    },
    incr: function (value, options) {
        var nc=parseInt(value);
        return nc;
    },
    
}