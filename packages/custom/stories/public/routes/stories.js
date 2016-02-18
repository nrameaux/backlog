'use strict';

angular.module('mean.stories').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('create story', {
        url: '/stories/create',
        templateUrl:'stories/views/story/create.html'
    })
    .state('create story with params', {
        url: '/stories/create/:version/:team/:iteration/:storyId',
        templateUrl:'stories/views/story/create.html'
    })
    .state('story by id', {
        url: '/stories/:storyId',
        templateUrl: 'stories/views/story/view.html'
    })
    .state('edit story by id', {
        url: '/stories/:storyId/edit',
        templateUrl: 'stories/views/story/edit.html'
    })
    .state('all teams', {
        url: '/teams',
        templateUrl: 'stories/views/team.html'
    })
    .state('functional backlog', {
        url: '/backlog-fonctionnel/:team',
        templateUrl: 'stories/views/functionnalBacklog.html'
    })
    .state('technical backlog', {
        url: '/backlog-technique',
        templateUrl: 'stories/views/technicalBacklog.html'
    })
    .state('view lot', {
        url: '/lots',
        templateUrl: 'stories/views/lot/list.html'
    })
    .state('view iteration', {
        url: '/iterations',
        templateUrl: 'stories/views/iteration/view.html'
    })
    .state('create iteration', {
        url: '/iterations/create',
        templateUrl:'stories/views/iteration/create.html'
    })
    .state('create lot', {
        url: '/lots/create',
        templateUrl:'stories/views/lot/create.html'
    })
    .state('lot by id', {
        url: '/lots/:lotId',
        templateUrl: 'stories/views/lot/view.html'
    })
    .state('edit lot by id', {
        url: '/lots/:lotId/edit',
        templateUrl: 'stories/views/lot/edit.html'
    })
    .state('corbeille', {
        url: '/corbeille',
        templateUrl: 'stories/views/functionnalBacklog.html'
    });
  }
]);
