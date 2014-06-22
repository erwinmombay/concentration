module.exports = (grunt) ->
  grunt.initConfig
    paths:
      client:
        coffee: 'src/coffee/**/*.coffee'
        styles: 'src/styles'
        specs: 'specs/*.coffee'
        libs: 'src/js/libs'
      server:
        js: 'public/js'
        styles: 'public/styles'

    watch:
      coffee:
        files: ['<%= paths.client.coffee %>']
        tasks: ['cs', 'less:prod']
      less:
        files: ['<%= paths.client.styles %>/**/*.less']
        tasks: ['less:prod']
      test:
        files: ['<%= paths.client.specs %>']
        tasks: ['test', 'karma:unit']

    nodemon:
      dev:
        script: 'server.coffee'

    coffee:
      options:
        sourceMap: false
      compile:
        files:
          'public/js/app.js': ['build/build.coffee']
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

    clean:
      public: 'public'
      coffee: 'build'

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
      preJs:
        src: [
          '<%= paths.client.libs %>/TweenMax.min.js'
        ]
        dest: 'public/js/pre-libs.js'
      postJs:
        src: [
          '<%= paths.client.libs %>/angular-animate.min.js'
          '<%= paths.client.libs %>/ng-Fx.min.js'
        ]
        dest: 'public/js/post-libs.js'
      coffee:
        src: ['<%= paths.client.coffee %>']
        dest: 'build/build.coffee'

    copy:
      maps:
        files: [
          expand: true
          cwd: 'src/js/libs'
          src: ['*.map']
          dest: 'public/js'
        ]

  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-nodemon'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-less'

  grunt.registerTask 'cs', [
    'clean:public'
    'concat:coffee'
    'coffee'
    'concat:preJs'
    'concat:postJs'
    'clean:coffee'
    'copy:maps'
  ]
  grunt.registerTask 'test', ['default', 'coffee:clientSpecs']
  grunt.registerTask 'default', ['cs', 'less:prod']
  grunt.registerTask 'production', ['default']
  grunt.registerTask 'heroku', ['default']
