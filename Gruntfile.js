const fs = require('fs');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        babel: {
            build: {
                files: {
                    'index.js': 'index.ts',
                    'call-instance-method.js': 'call-instance-method.ts'
                }
            }
        }
    });
    
    grunt.registerTask('postprocess', postprocess);
    grunt.registerTask('default', ['babel', 'postprocess']);


    //////////


    function postprocess() {
        fs.writeFileSync(
            'index.js',
            fs.readFileSync('index.js') + '\nmodule.exports = exports.default;\n'
        );

        fs.writeFileSync(
            'call-instance-method.js',
            fs.readFileSync('call-instance-method.js').toString().replace(
                'exports.__esModule = true;',
                'Object.defineProperty(exports, "__esModule", {\n    value: true\n});'
            )
        );
    }
};