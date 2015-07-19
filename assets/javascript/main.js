(function(){
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

}).call(this);
