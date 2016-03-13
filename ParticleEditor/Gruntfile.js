var path = require('path');

module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            dist: {

                src: ['lib/alloy_paper.js','lib/blob.js' ,'src/PE.js', 'src/Util.js', 'src/Vector2.js', 'src/CircleAdjust.js', 'src/RectAdjust.js','src/Particle.js', 'src/ParticleSystem.js', 'src/Main.js', ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', [ 'concat', 'uglify']);
};
