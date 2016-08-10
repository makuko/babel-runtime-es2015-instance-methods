/**
 * Wraps calls to ES2015 instance methods of Array and String
 * with a call to a polyfill that then uses the ponyfills of
 * core.js.
 */

export default function({types: t}) {
    return {
        visitor: {
            /**
             * We need to check every method call and use
             * the polyfill when its name is one of the
             * names of the new instance methods. 
             */
            CallExpression(path, state) {
                var node = path.node,
                    callee = node.callee,
                    property;
                
                if (!t.isMemberExpression(callee)) {
                    return;
                }
                
                property = callee.property;
                
                if (callee.computed || METHODS.indexOf(property.name) < 0) {
                    return;
                }
                
                path.replaceWith(
                    t.callExpression(
                        state.addImport('babel-runtime-instance-methods/call-instance-method', 'default', 'callInstanceMethod'),
                        [
                            callee.object,
                            t.stringLiteral(property.name),
                            t.arrayExpression(node.arguments)
                        ]
                    )
                );
            }
        }
    };
}


//////////


var METHODS = [
        // Array
        'copyWithin',
        'entries',
        'fill',
        'find',
        'findIndex',
        'keys',
        'values',
        
        // String
        'codePointAt',
        'endsWith',
        'includes',
        'repeat',
        'startsWith'
    ];