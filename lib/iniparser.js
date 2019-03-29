let tokenize = function(s) {
    let from = 0;
    let pos = 0;

    let make = function (type, value) {
        let token = {
            type: type,
            value: value,
            from: from,
            to: pos,
        }
        return token;
    }

    let advance = function (str) {
        pos += str.length;
    }

    const TOKEN_TYPE = {

        SECTION: {
            regex: /\[(.+?)\]/y,
            parse: function (str) {
                let match = this.regex.exec(str);
                advance(match[0]);
                return [make('section', match[1])];
            }
        },

        COMMENT: {
            regex: /;.*/y,
            parse: function (str) {
                let match = this.regex.exec(str);
                advance(match[0]);
                return null;
            }
        },

        PROPERTY: {
            regex: /(.+?)=(.*)/y,
            parse: function (str) {
                let match = this.regex.exec(str);
                advance(match[0]);
                return [make('property', match[1]), make('value', match[2])];
            }
        },

        WHITES: {
            regex: /\s+/y,
            parse: function (str) {
                let match = this.regex.exec(str);
                advance(match[0]);
                return null;
            }
        },
    }

    let result = [];

    while (pos < s.length) {
        let match = false;

        // Update last index in regexes
        for (let t in TOKEN_TYPE) {
            TOKEN_TYPE[t].regex.lastIndex = pos;
        }

        // Find matchs
        for (let t in TOKEN_TYPE) {
            if (TOKEN_TYPE[t].regex.test(s)) {

                match = true;
                from = pos;
                TOKEN_TYPE[t].regex.lastIndex = from;
                tobj = TOKEN_TYPE[t].parse(s);
                if (tobj !== null) {
                    result.push(...tobj);
                }
                break;
            }
        }

        if (!match) {
            throw `Syntax error near '${s.substr(pos, pos + 10)}', char ${pos}`;
        }
    }

    return result;
}

let parse = function (str) {
    tokens = tokenize(str);
    let ast = [];
    let i = 0;

    let makeSection = function (section, properties) {
        return {
            type: section.type,
            value: section.value,
            properties: properties,
        };
    }

    let makeProperties = function (from) {
        let properties = [];
        while (from < tokens.length) {
            let prop = tokens[from];

            if (prop.type === null || prop.type === 'section') {
                break; // section or nothing found
            } else if (prop.type !== 'property') {
                throw `Parse error: property type -> ${prop.type}[${i}] (expected property)`;
            }

            if (from + 1 >= tokens.length) {
                throw `Parse error: expected more tokens`;
            }

            let val = tokens[from + 1];

            if (val.type !== 'value') {
                throw `Parse error: value type -> ${val.type}[${i + 1}] (expected value)`
            }

            properties.push({
                type: prop.type,
                name: prop.value,
                value: val.value,
            });

            from += 2;
            i = from - 1; // i will be incremented at the end of the while below
        }

        return properties;
    }

    while (i < tokens.length) {
        let t = tokens[i];
        if (t.type === 'section') {
            ast.push(makeSection(t, makeProperties(i + 1)))
        } else if (t.type === 'property') {
            ast.push(makeProperties(i))
        } else {
            console.error("Nope");
        }
        i++;
    }

    return ast;
}

module.exports.parse = parse;