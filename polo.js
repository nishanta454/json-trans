const jp = require('jsonpath');

const ARRAY = "array";

const process = function (value, defVal, _function) {
    let result = defVal;
    result = new Function(context.functions._function).call({
        'value': value,
        'defVal': defVal
    })
    
    return result;
}

const update = function (source, targetKey, targetValue) {
    var keys = jp.parse(targetKey);
    var prev = undefined;
    var val = undefined;
    while ((key = keys.shift())) {
        if(key.expression.type!='root'){
            if(key.operation == 'member'){
                if(keys.length === 0){
                    source[key.expression.value] = targetValue
                } else if(source[key.expression.value]) {
                    prev = source;
                    source = source[key.expression.value]
                } else {
                    prev = source;
                    source[key.expression.value] = {}
                    source = source[key.expression.value];
                }
            }
            else if(key.operation == 'subscript'){
                if(!Array.isArray(source)){
                    prev[val] = [];
                    source = prev[val]
                }
                if(keys.length === 0){
                   source[key.expression.value] = targetValue
                } else {
                   if(source[key.expression.value] && Array.isArray(source)){
                       prev = source;   
                       source = source[key.expression.value]
                   }
                }
            }
        }
        val = key.expression.value
    }
}

const transformer = {
    transform: function (data, schema, context) {
        let type = schema.type;
        let result = type === ARRAY ? [] : {};
        let fields = schema.fields;
        if (fields && Array.isArray(fields)) {
            let operation = schema.operation;
            fields.forEach(field => {
                if (field) {
                    let path = field.path
                    var value = field.value;
                    let defVal = field.default;
                    if (value) {
                        value = jp.query(data, '$.' + value);
                        value = value ? value[0] : undefined
                        if(value && operation && context.functions && context.functions[operation]) {
                            value = process(value, defVal, context.functions[operation]);
                        }
                    } else {
                        value = defVal;
                    }
                    update(result, path, value);
                }
            });
            if (context.callback) {
                context.callback(result);
            } else {
                return result;
            }
        }
    }
}
return module.exports = transformer