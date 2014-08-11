module.exports = function(grunt) {
    grunt.initConfig({
        jasmine_node: {
        	options: {
        		forceExit: true
        	},
            all: ['lib/','tests/']
        },
        watch: {
            files: ['<%= jasmine_node.src %>'],
            tasks: ['jasmine_node']
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('runTests', ['jasmine_node']);
}