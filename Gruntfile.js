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
        },
        {
          expand: true,
          cwd: 'ngraph.pixel/demo/basic/',
          src: ['bundle.js'],
          dest: 'public/javascripts/ngraph.pixel.basic'
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

      pixel: {
        options: {
          cmd: 'run',
          args: ['basic'],
          cwd: 'ngraph.pixel/'
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-npm-command');
  grunt.registerTask('build', ['npm-command', 'copy']);
};