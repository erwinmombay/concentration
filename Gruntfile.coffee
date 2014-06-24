module.exports = (grunt) ->
  grunt.initConfig
    paths:
      client:
        coffee: 'src/client/coffee'
        styles: 'src/client/styles'
        libs: 'src/client/js/libs'
        build: 'src/client/build'
        img: 'src/client/img'
        fonts: 'src/client/fonts'
      server:
        specs: 'specs/coffee/**/*.coffee'
        js: 'src/server/public/js'
        styles: 'src/server/public/styles'

    watch:
      coffee:
        files: ['<%= paths.client.coffee %>/**/*.coffee']
        tasks: ['cs', 'less:prod']
      less:
        files: ['<%= paths.client.styles %>/**/*.less']
        tasks: ['less:prod']
      test:
        files: ['<%= paths.server.specs %>']
        tasks: ['test', 'karma:unit']
      js:
        files: ['<%= paths.client.libs %>/*.*']
        task: ['concat:preJs', 'concat:PostJs']

    nodemon:
      dev:
        script: 'app.coffee'

    coffee:
      options:
        sourceMap: false
      compile:
        files:
          'src/server/public/js/app.js': ['<%= paths.client.build %>/build.coffee']
      clientSpecs:
        files: (grunt.file.expandMapping ['specs/coffee/**/*.coffee'], 'specs/js/',
          rename: (destBase, destPath) ->
            "#{destBase}#{destPath
                .replace(/\.coffee$/, ".js")
                .replace(/// specs/ ///, "")}"
        )

    less:
      prod:
        options:
          yuicompress: true
        files:
          'src/server/public/styles/app.css': ['<%= paths.client.styles %>/app.less']

    clean:
      public: 'src/server/public'
      coffee: 'src/client/build'

    karma:
      options:
        configFile: './config/karma.conf.coffee'
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
        dest: '<%= paths.server.js %>/pre-libs.js'
      postJs:
        src: [
          '<%= paths.client.libs %>/angular-animate.min.js'
          '<%= paths.client.libs %>/ng-Fx.min.js'
        ]
        dest: '<%= paths.server.js %>/post-libs.js'
      coffee:
        src: ['<%= paths.client.coffee %>/**/*.coffee']
        dest: '<%= paths.client.build %>/build.coffee'

    copy:
      img:
        files: [
          expand: true
          cwd: 'src/client/img'
          src: ['*.jpg']
          dest: 'src/server/public/img'
        ]
      maps:
        files: [
          expand: true
          cwd: 'src/client/js/libs'
          src: ['*.map']
          dest: 'src/server/public/js'
        ]
      fonts:
        files: [
          expand: true
          cwd: 'src/client/fonts'
          src: ['*.*']
          dest: 'src/server/public/fonts'
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
    'clean:coffee'
    'less:prod'
    'concat:preJs'
    'concat:postJs'
    'copy:maps'
    'copy:img'
    'copy:fonts'
  ]
  grunt.registerTask 'test', ['default', 'coffee:clientSpecs']
  grunt.registerTask 'default', ['cs']
  grunt.registerTask 'production', ['default']
  grunt.registerTask 'heroku', ['default']
