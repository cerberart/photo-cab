(function(){
angular.module('photoApp', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'index.html',
            controller: 'photoController'
        })
        .state('link', {
            url: '/link',
            templateUrl: 'link.html',
            controller: 'photoController'
        })
        .state('link.start', {
            url: '/start',
            templateUrl: 'views/start.html',
            controller: function($rootScope,$state,$scope,mainjs){
                $scope.modal = mainjs.main();
                $rootScope.currentStateName = $state.current.name;
            }
        })
        .state('link.step-1', {
            url: '/step-1',
            templateUrl: 'views/step-1.html',
            controller: function($rootScope,$state,$scope,mainjs){
                $scope.modal = mainjs.main();
                $rootScope.currentStateName = $state.current.name;
            }
        })
        .state('link.step-2', {
            url: '/step-2',
            templateUrl: 'views/step-2.html',
            controller: function($rootScope,$state,$scope,mainjs){
                $scope.modal = mainjs.main();
                $rootScope.currentStateName = $state.current.name;
            }
        })

        .state('link.step-3', {
            url: '/step-3',
            templateUrl: 'views/step-3.html',
            controller: function($rootScope,$state,$scope,mainjs){
                $rootScope.currentStateName = $state.current.name;
                $scope.modal = mainjs.main();
            }
        })
        .state('link.step-4', {
            url: '/step-4',
            templateUrl: 'views/step-4.html',
            controller: function($rootScope,$state,$scope,mainjs){
                $rootScope.currentStateName = $state.current.name;
                $scope.modal = mainjs.main();
            }
        })
        .state('link.finish', {
            url: '/finish',
            templateUrl: 'views/finish.html',
            controller: function($rootScope,$state,$scope,mainjs){
              $rootScope.currentStateName = $state.current.name;
              $scope.modal = mainjs.main();
            }
        })

    $urlRouterProvider.otherwise('/link/start');
})
.value('photoSteps', [
  {uiSref: 'link.start'},
  {uiSref: 'link.step-1'},
  {uiSref: 'link.step-2'},
  {uiSref: 'link.step-3'},
  {uiSref: 'link.step-4'},
  {uiSref: 'link.finish'}
])
.run([
    '$rootScope',
    '$state',
    'photoSteps',
    function($rootScope, $state, photoSteps) {
        $rootScope.Utils = {
            keys : Object.keys
        }
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var canGoToStep = false;

            var toStateIndex = _.findIndex(photoSteps, function(photoStep) {
            return photoStep.uiSref === toState.name;
            });
            console.log('toStateIndex',toStateIndex)
            if(toStateIndex === 0) {
            canGoToStep = true;
            } else {
            canGoToStep = photoSteps[toStateIndex + 1];
            }
        });
    }
])
.controller('photoController', function($rootScope, $scope, $http, $state, photoSteps, formData, mainjs) {
  // storages for data
  $scope.modal = mainjs.main();
  $rootScope.$state = $state;
  $rootScope.formData = formData;
  $rootScope.validStep = [];
  $rootScope.PickedPhotos = {};
  $rootScope.photos = [
    {id: 1, url: '/assets/images/panda-action.png'},
    {id: 2, url: '/assets/images/panda-action.png'},
    {id: 3, url: '/assets/images/panda-action.png'},
    {id: 4, url: '/assets/images/panda-action.png'},
    {id: 5, url: '/assets/images/panda-action.png'},
    {id: 6, url: '/assets/images/panda-action.png'},
    {id: 7, url: '/assets/images/panda-action.png'},
    {id: 8, url: '/assets/images/panda-action.png'},
    {id: 9, url: '/assets/images/panda-action.png'},
    {id: 10, url: '/assets/images/panda-action.png'}
  ];
  var nextState=function(currentState) {
    switch (currentState) {
        case 'link.start':
            return 'link.step-1'
            break;
        case 'link.step-1':
            return 'link.step-2'
            break;
        case 'link.step-2':
            return 'link.step-3'
            break;
        case 'link.step-3':
            return 'link.step-4'
            break;
        case 'link.step-4':
            return 'link.finish'
            break;
        default:
            alert('Error. Nothing pass from states.');
    }
  };
  $scope.goToNextSection=function() {
    $state.go(nextState($state.current.name));
    $rootScope.validStep.push($state.current.name);
  }
  $scope.$watch('PickedPhotos', function(newVal, oldVal){
    console.log($rootScope.PickedPhotos);
  });
})
.factory("mainjs", function(){
  return {
    main: function(){
      $doc = $(document);

      this.modalOpen = function(type, event){
        var $type, $modal, $body, $bodyClass;
        $type = type;
        $modalContent = $('.modal-block-content');
        $body = $('body');
        $bodyClass = function(){$body.addClass('layout-is-open ' + type + '-layout');};
        if(event == "show"){
          if ($body.hasClass('carrot-layout')){
            $body.removeClass('carrot-layout');
            $bodyClass();
          }
          if ($body.hasClass('main-layout')){
            $body.removeClass('main-layout');
            $bodyClass();
          } else {
            $bodyClass();
          }
        }
        if(event == "hide"){
          $body.removeClass('layout-is-open ' + type + '-layout');
        }
      }

      setTimeout(function(){
        var theCheckboxes = $("input[type='checkbox']");
        theCheckboxes.click(function(){
          if (theCheckboxes.filter(":checked").length > 3)
              $(this).removeAttr("checked");
          });
      }, 500);

      $doc.on('click touch touchstart', '.js-open-layout', function(){
        var $type, $link;
        $link = $(this);
        $type = $link.data('type');
        if ($link.hasClass('js-close-layout')){
          $link.removeClass('js-close-layout');
          modalOpen($type, "hide");
        } else {
          $('.js-open-layout').removeClass('js-close-layout');
          $link.addClass('js-close-layout');
          modalOpen($type, "show");
        }

      });

    }
  }
})
.factory("formData",function(){
    return {};
});

})();
