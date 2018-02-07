module.exports = function (grunt) {
  grunt.initConfig({
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'sigma.js/build/',
          src: ['sigma.*',
            'plugins/sigma.layout.*',
            'plugins/sigma.plugins.animate.min.js'
          ],
          dest: 'public/javascripts/sigma'
        }]
      }
    },
    'npm-command': {
      sigma: {
        options: {
          cmd: 'run',
          args: ['build'],
          cwd: 'sigma.js/'
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-npm-command');
  grunt.registerTask('build', ['npm-command', 'copy']);
};