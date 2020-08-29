const jp = require('jsonpath');

let parser = {
    parse: function (fromPayload, toPayload, dataDictonary) {
        dataDictonary.forEach(mapping => {
            this.updateObject(mapping.source, mapping.target, fromPayload, toPayload)
        });
        console.log(toPayload)
    },
    updateObject: function (sourcePath, targetField, fromPayload, toPayload) {
        var path = jp.paths(fromPayload, '$.' + sourcePath)
        if (path && path.length > 0) {
            var prog = [];
            var stop = false;
            var arrays = {}
            path[0].forEach((node, index) => {
                if (node != '$' && !stop) {
                    prog.push(node)
                    var value = jp.query(fromPayload, util.createJpExp(prog, arrays));
                    if (util.findType(value[0]) == 'String' || index == path[0].length - 1) {
                        toPayload[targetField] = value[0]
                    } else if (util.findType(value[0]) == 'Array') {
                        stop = true;
                        arrays[node] = true;
                        if (util.findType(value[0][0]) == 'String') {
                            toPayload[targetField] = value[0]
                        } else {
                            if (!toPayload[node] || util.findType(toPayload[node]) != 'Array') {
                                toPayload[node] = [];
                            }
                            toPayload = toPayload[node]
                            value[0].forEach((val, indx) => {
                                var elem = null;
                                if (toPayload.length > indx) {
                                    elem = toPayload[indx]
                                } else {
                                    elem = {}
                                    toPayload.push(elem)
                                }
                                this.updateObject(util.shrinkJpExp(sourcePath, prog), targetField, val, elem)
                            })
                        }
                    }
                }
            })
        }
    }
}

let util = {
    findType: function (s) {
        if (s.constructor === String) {
            return "String";
        }
        if (s.constructor === Array) {
            return "Array";
        } else if (s.constructor === Object) {
            return "Object";
        } else if (s.constructor === Number) {
            return "Number";
        } else if (s.constructor === Boolean) {
            return "Boolean";
        }
    },
    shrinkJpExp: function (s, p) {
        let exp = s.replace(p.join('.'), '').replace('[*]', '')
        let nxp = []
        exp.split('.').forEach(function (el) { 
            if(el){
                nxp.push(el);
            }
        });
        return nxp.join('.');
    },
    createJpExp: function(p, ar) {
         var exp = ['$']
         p.forEach(el => {
             if(ar[el]){
                exp.push(el+'[*]')
             }else {
                exp.push(el)
             }
         })
         return exp.join('.')
    }
}

var fromPayload = {
    "a": "1",
    "r": {
        "n": "nishant",
        "z": "pro",
        "c": {
            "1": "name",
            "3": "pqr"
        }
    },
    "b": {
        "name": "nishant",
        "age": "31",
        "sex": "M",
        "contact": {
            "addresses": [{
                "line1": "Gandhi Colony",
                "line2": "Golok Dham, Muzaffarnagar"
            },
            {
                "line1": "D-41",
                "line2": "Sec-20, Noida",
                "line3": [{
                    "p.o.box": "11111",
                    "tehsil": "kairana"
                }],
                "line4": {
                    "nos": "nmi",
                    "kal": "lac"
                }
            },
            {
                "line1": "H-278"
            }],
            "phone": {
                "mobile": "9582965097",
                "landline": "01313250615"
            }
        }
    }
}

var toPayload = {

}

var dataDictonary = [{
    "source": "a",
    "target": "x"
},
{
    "source": "r.n",
    "target": "v"
}, {
    "source": "r.z",
    "target": "l"
}, {
    "source": "r.c",
    "target": "com"
}, {
    "source": "b.contact.addresses[*].line1",
    "target": "line1"
}, {
    "source": "b.contact.addresses[*].line2",
    "target": "line2"
}, {
    "source": "b.contact.addresses[*].line4.nos",
    "target": "nos"
}, {
    "source": "b.contact.addresses[*].line3[*].tehsil",
    "target": "tehsil"
}]

parser.parse(fromPayload, toPayload, dataDictonary);

//module.exports = parser