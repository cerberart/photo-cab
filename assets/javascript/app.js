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
  // вызывается код из фактори, туда же можно впихывать еще что угодно
  $scope.modal = mainjs.main();

  //Значение локейшена, используется для класса на body, вдруг понадобится че
  $rootScope.$state = $state;

  //Для каких нибудь очень важных значение, сделано через factory, можно передавать в разные контроллеры, если нужно. сейчас он для всех контроллеров один
  $rootScope.formData = formData;

  //Записи пройденных этапов, хз для чего хотел делать, но пускай будет
  $rootScope.validStep = [];

  //Количество отщелканных фотографий
  $rootScope.shootedPhotos = 0;

  //Для выбранных фотографий, если значение 1, значит кнопки получают активный класс
  $rootScope.pickedPhotos = 0;

  //Для фотографий
  $rootScope.photos = [
    {"id": 1, "url": '/assets/images/panda-action.png'},
    {"id": 2, "url": '/assets/images/panda-action.png'},
    {"id": 3, "url": '/assets/images/panda-action.png'},
    {"id": 4, "url": '/assets/images/panda-action.png'},
    {"id": 5, "url": '/assets/images/panda-action.png'},
    {"id": 6, "url": '/assets/images/panda-action.png'},
    {"id": 7, "url": '/assets/images/panda-action.png'},
    {"id": 8, "url": '/assets/images/panda-action.png'},
    {"id": 9, "url": '/assets/images/panda-action.png'},
    {"id": 10, "url": '/assets/images/panda-action.png'}
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
  var backState=function(currentState) {
    switch (currentState) {
        case 'link.step-1':
            return 'link.start'
            break;
        case 'link.step-2':
            return 'link.step-1'
            break;
        case 'link.step-3':
            return 'link.step-2'
            break;
        case 'link.step-4':
            return 'link.step-3'
            break;
        case 'link.finish':
            return 'link.step-4'
            break;
        default:
            alert('Error. Nothing pass from states.');
    }
  };
  $scope.modal=function(){
    mainjs.modal();
  }
  $scope.startWork=function(){
    $state.go(nextState($state.current.name));
  }
  $scope.goToPrevSection=function(){
    if ($state.current.name == 'link.step-1') {
      alert('1');
      // $state.go(backState($state.current.name));
    } else {
      $state.go(backState($state.current.name));
    }
  }
  $scope.goToNextSection=function($event) {
    if ($state.current.name == 'link.step-1') {
      if (angular.element($event.target).hasClass('is-active')){
        $state.go(nextState($state.current.name));
      } else {
        return false;
      }
    }
    if ($state.current.name == 'link.step-2') {
      if ($rootScope.pickedPhotos == 1)
        $state.go(nextState($state.current.name));
    }

    // $state.go(nextState($state.current.name));
    $rootScope.validStep.push($state.current.name);
  }
  $scope.checkListChecboxes=function(){
    var theCheckboxes = $("input[type='checkbox']");
    theCheckboxes.each(function(){
      if (theCheckboxes.filter(":checked").length >= 3){
        $rootScope.pickedPhotos = 1;
      }
      else {
        $rootScope.pickedPhotos = 0;
      }
    });
  }
  $scope.shoot = function($event){
    if ($('.shoot-act-bg').hasClass('is-animated')) {
      return false;
    } else {
        $('.shoot-act-bg').addClass('is-animated');
        $('.photo-preview').addClass('is-animated');
        $('.layout-attention').addClass('is-opened');
        setTimeout(function(){
          $('.layout-attention').removeClass('is-opened');
        },2800);
        setTimeout(function(){
          $('.photo-preview').removeClass('is-animated');
          $('.shoot-act-bg').removeClass('is-animated');
        }, 3800);
        $rootScope.shootedPhotos += 1;
    }
    if ($rootScope.shootedPhotos >= 3) {
      $('.next-step').addClass('is-active');
    }
    if ($rootScope.shootedPhotos >= 9) {
      $rootScope.shootedPhotos = 9
    }
  }
  $scope.$watch('formData', function(newVal, oldVal){
    // console.log($rootScope.formData);
  });
})
.factory("mainjs", function(){
  return {
    main: function(){
      $doc = $(document);
      setTimeout(function(){
        var theCheckboxes = $("input[type='checkbox']");
        var CheckboxArray = [];
        theCheckboxes.click(function(){
          CheckboxArray.push($(this).attr('id'));
          var id = CheckboxArray.slice(0)[0];
          console.log(CheckboxArray[0]);
          if (theCheckboxes.filter(":checked").length > 3) {
              // $(this).removeAttr("checked");
              $('.gallery-images').find('input#' + id).removeAttr("checked");
              CheckboxArray.shift();
            }
          });
      }, 500);
    },
    modal: function(){
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
