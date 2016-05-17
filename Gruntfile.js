module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'sigma.js/build/',
                    src: ['sigma.min.js',
                        'plugins/sigma.layout.*',
                        'plugins/sigma.plugins.animate.min.js'],
                    dest: 'public/javascripts/'
                }]
            }
        }
    });

    grunt.registerTask('run-grunt', function() {
        var cb = this.async();
        grunt.util.spawn({
            cmd: 'npm',
            args: ['run', 'build'],
            opts: {
                cwd: 'sigma.js/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            cb();
        });
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('build', ['run-grunt', 'copy']);
};