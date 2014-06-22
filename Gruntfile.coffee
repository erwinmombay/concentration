module.exports = (grunt) ->
  grunt.initConfig
    paths:
      client:
        coffee: 'src/coffee/**/*.coffee'
        styles: 'src/styles'
        specs: 'specs/*.coffee'
      server:
        js: 'public/js'
        styles: 'public/styles'
    watch:
      coffee:
        files: ['<%= paths.client.coffee %>']
        tasks: ['cs']
      less:
        files: ['<%= paths.client.styles %>/**/*.less']
        tasks: ['less:prod']
      test:
        files: ['<%= paths.client.specs %>']
        tasks: ['test', 'karma:unit']

    nodemon:
      dev:
        script: 'server.coffee'

    copy:
      coffee:
        files: [
          expand: true
          cwd: 'src/client'
          src: ['coffee/*.*']
          dest: 'public'
        ]

    coffee:
      options:
        sourceMap: false
      compile:
        files:
          'public/js/app.js': ['<%= paths.client.coffee %>']
      clientSpecs:
        files: (grunt.file.expandMapping ['specs/*.coffee'],
          'specs/js/',
          rename: (destBase, destPath) ->
            destBase + destPath
              .replace(/\.coffee$/, '.js')
              .replace(/// specs/ ///, '')
        )

    less:
      prod:
        options:
          yuicompress: true
        files:
          'public/styles/app.css': ['<%= paths.client.styles %>/app.less']
    karma:
      options:
        configFile: './config/karma.conf.js'
        runnerPort: 9999
        reporters: ['dots']
        colors: true
      unit:
        singleRun: true
      dev:
        autoWatch: true
        browsers: ['Chrome']

    concat:
      js:
        src: ['src/js/libs/*.js']
        dest: 'public/js/libs.js'

  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-nodemon'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-less'

  grunt.registerTask 'cs', ['copy:coffee', 'coffee', 'concat:js']
  grunt.registerTask 'test', ['default', 'clean:sourceMaps', 'coffee:clientSpecs']
  grunt.registerTask 'default', ['cs', 'less:prod']
  grunt.registerTask 'production', ['default', 'clean:sourceMaps']
  grunt.registerTask 'heroku', ['default']
