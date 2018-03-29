var token = localStorage.getItem('token');

/*при клике на пункт меню*/
$('[data-tab]').click(function(e){
// e.preventDefault();
var tab = $(this).data('tab');
// console.log(tab);

/*если data-tab у пункта меню не новый альбом, 
то убираем контент и ставим соответствующий другой контент*/
if(tab!=='new-album'){
  $('[data-content]').fadeOut();
  setTimeout(function(){
    $('[data-content =  ' + tab + ']').fadeIn();
  },500);
}
/**/

/*если data-tab у пункта меню = новый альбом, то не убираем контент от альбомов*/
else if(tab=='new-album'){
  var tabalbums = $('.nav-link__albums').data('tab');
  $('[data-content =  ' + tabalbums + ']').fadeIn();
}
/**/


/*если data-tab у пункта меню = добавление фото, то пусть открытым остается контент
для всех фотографий*/
if(tab=='new-photo'){
  e.stopPropagation();
  console.log('Новое фото загружать сейчас будем');
  var tabNewPhoto = $('.nav-link__photos').data('tab');
  $('[data-content =  ' + tabNewPhoto + ']').fadeIn();

  /*добавляем новый блок, в который потом будем подтягивать фотографию, которая загружена*/
  // var newPhoto = document.createElement('li');
  // newPhoto.className='photo-item';
  // newPhoto.innerHTML='<b>Тут когда-то будет ваше фото, если Вы его загрузите </b>'
  // photos.append(newPhoto);
  // checkPhotoItem();
}
/**/

/*если мы нажимаем на удалить альбом, то в контенте открываются альбомы*/
if(tab=='remove-album'){
var tabalb = $('.nav-link__albums').data('tab');
  $('[data-content =  ' + tabalb + ']').fadeIn();
}



$('a').removeClass('active');
$('label').removeClass('active');
$(this).addClass('active');


$('.active').css({
  'fontWeight' : 'bold',
  'fontSize' : '18px'
})


$('.active').siblings().css({
  'fontWeight' : 'normal',
  'fontSize' : '16px'
})


if($(this).data('tab')=='albums'){
  $('.nav-link__new-album').css('display', 'inline-block')
};



if($(this).data('tab') !== 'albums' && $(this).data('tab') !== 'new-album'){
  $('.nav-link__new-album').css('display', 'none')
};

});







// $('.nav-link__new-album').click(ShowModal);
// /*создаем модальное окно для ввода наименования альбома*/
// function ShowModal(){
//   $('.modal').remove();
//   var overlay = document.createElement('div');
//   var modalContainer = document.createElement('div');
//   var modalTitle = document.createElement('div');
  
//   var modalClose = document.createElement('a');

//   var modalEdit = document.createElement('button');
//   var modalNewElem = document.createElement('div');
//   var modalNewElemInput = document.createElement('input');

//   $(modalClose)
//   .attr('href', '#')
//   .text('x')
//   .addClass('modal-close');

//   $(modalTitle)
//   .addClass('modal-title')
//   .append('New album', modalClose);

//   $(modalNewElemInput)
//   .addClass('modal-newElemInput')
//   .attr('id', 'newElemInput')
//   // .attr('placeholder', 'Введите название');

//   $(modalEdit)
//   .addClass('modal-edit')
//   .text('Create')
//   .css({
//     'background-color' : 'blue',
//     'color' : '#fff'
//   })

//   $(modalNewElem)
//   .addClass('modal-newElem')
//   .append('Album name:',modalNewElemInput, modalEdit);

//   $(modalContainer)
//   .addClass('modal')

//   .append(modalTitle, modalNewElem) ;

//   $(overlay).addClass('modal-overlay')
//   .append(modalContainer);

//   $('script:last-of-type').after(overlay);
// }


// $('body').on('click', '.modal-edit', function(){


//     // var newMenuItem = document.createElement('li');
//     // $(newMenuItem).addClass('album-item');
//     // var a=$(modalNewElemInput).val();
//     // $(newMenuItem).text(a);

//     // albums.append(newMenuItem);
    
//     // $('.modal').remove();
//     // $('.modal-overlay').remove();


//     // debugger;
//     // console.log('1', $('#newElemInput').val());


//     var tabalbums = $('.nav-link__albums').data('tab');
//     $('[data-content =  ' + tabalbums + ']').fadeIn();

//     $('a').removeClass('active');
//     $('label').removeClass('active');
//     // $(this).addClass('active');

//     $('.nav-link__albums').addClass('active');
//     // checkAlbumItem();


//       console.log('создан новый альбом');
//       // App.AlbumControllerPost(token, $('#newElemInput').val());
//       App.AlbumControllerPost(token);
//       App.AlbumController(token);
//       $('.modal').remove();
//       $('.modal-overlay').remove();

//   });

//   $('.modal-close').click(function(){
//     $('.modal').remove();
//     $('.modal-overlay').remove();
//   });


/*конец модального окна*/









/*при нажатии на конкретный альбом*/
$('body').on('click', '.albums__name', function(){
  $('.nav-link__new-album').css('display', 'none');
  $('.nav-link__photos').css('display', 'inline-block');
  $('.nav-link__new-photo').css('display', 'inline-block');
  $('.nav-link__remove-album').css('display', 'inline-block');
  $('.createProfile__header').css({
    'height' : '60px'
  });
  // $(this).addClass('activeAlbum');
  $('.user__information').fadeOut();

  $('.tab-panel').css({
    'marginLeft':'25%'
  })

  $('.nav-link__albums').removeClass('active');

  $('.nav-link__photos').addClass('active');

  $('[data-content]').fadeOut();
  var tab = $('.nav-link__photos').data('tab');
  setTimeout(function(){
    $('[data-content =  ' + tab + ']').fadeIn();
  },0);

  $('.active').siblings().css({
    'fontWeight' : 'normal',
    'fontSize' : '16px'
  })


/*ищем, есть ли пункты меню в фотографиях, если их нет, либо же они пустые,
то показываем пункт меню, в котором текст для пустого пункта*/
if($('#photos').find(".photo-item").is(':empty')||(!$('#photos').find(".photo-item"))){
 $('.photo-item-empty').css({
   'display' : 'block'
 })
}
else{
 $('.photo-item-empty').css({
   'display' : 'none'
 })
}



});




/*конец нажатие на альбом*/




/*клик на удаление альбома - удаляем альбом этот, убираем у этого пункта меню класс актив
добавляем класс актив альбомам, показываем создание нового альбома и выполняем функцию */
// $('body').on('click', '.nav-link__remove-album', function(){

//   // $('.album-item.activeAlbum').remove();
//   $('.nav-link__remove-album').removeClass('active');
//   $('.nav-link__albums').addClass('active');
//   $('.nav-link__new-album').css('display', 'inline-block');
//   // checkAlbumItem();

// });







/*клик на пункт меню при условии, что информация про юзера поднята вверх, 
то, что будет необходимо сделать при клике на пункты меню Альбомы и профиль*/
$('[data-tab]').click(function(){

  var tab = $(this).data('tab');

  if((tab=='profile')||(tab=='albums')||(tab=='remove-album')){
    if($('.createProfile__header').css({
      'height' : '60px'
    })){
      $('.createProfile__header').css({
        'height' : '400px'
      });
      $('.user__information').fadeIn();
      $('.nav-link__new-album').css('display', 'inline-block');
      $('.nav-link__photos').css('display', 'none');
      $('.nav-link__new-photo').css('display', 'none');
      $('.nav-link__remove-album').css('display', 'none');

      $('.tab-panel').css({
        'marginLeft':'40%'
      });
    }

  };

  if($(this).data('tab')!=='albums'&&$(this).data('tab')!=='new-album'){
    $('.nav-link__new-album').css('display', 'none')
  };

});


/*конец*/




// /*При клике на Альбомы. если нет альбомов, то должно показать надпись о том, 
// что альбомов нет*/

// $('body').on('click','.nav-link__albums', checkAlbumItem);
// $('body').on('click','.nav-link__new-album', checkAlbumItem);


// function checkAlbumItem(){
//   var albumItem=$('.album-item');
//   if (albumItem.length>0){
//     console.log('nashlis');
//     $('.album-item-empty').css({
//       'display' : 'none'
//     });


//   }
//   else{
//     $('.album-item-empty').css({
//       'display' : 'block'
//     })
//   }
// };
// /**/



/*При клике на фотографии. если нет фотографий, то должно показать надпись о том, 
что фотографий нет*/
$('body').on('click','.album-item', checkPhotoItem);
$('body').on('click','.nav-link__new-photo', checkPhotoItem);

function checkPhotoItem(){
  var photoItem=$('.photo-item');
  if (photoItem.length>0){
    
    $('.photo-item-empty').css({
      'display' : 'none'
    })
  }
  else{
    $('.photo-item-empty').css({
      'display' : 'block'
    })
  }
};

