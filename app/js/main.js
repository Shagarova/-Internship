/*создаем глобальную переменную для загрузки фото для аватара*/
var globalPhoto;
var NewPhoto;
var token = localStorage.getItem('token');
var id = localStorage.getItem('user_id');
var albums_id;
// var Value = $('#newElemInput').val();
// var globalAlbumName;
// var albums_id = localStorage.getItem('albums_id');
/*переходы между формами*/
$('#forgotPassword').click(function(){
  $('.LoginForm.login').css({
    'display': 'none'
  })
  $('.LoginForm.email').css({
    'display': 'block'
  })
});

$('#newRegistration').click(function(){
  $('.LoginForm.login').css({
    'display': 'none'
  })
  $('.LoginForm.registration').css({
    'display': 'block'
  })
});

$('#ReturnLoginFromRegistration').click(function(){
  $('.LoginForm.registration').css({
    'display': 'none'
  })
  $('.LoginForm.login').css({
    'display': 'block'
  })
});


$('#ReturnLoginFromEmail').click(function(){
  $('.LoginForm.email').css({
    'display': 'none'
  })
  $('.LoginForm.login').css({
    'display': 'block'
  })
});

/*конец переходы между формами*/

/*при загрузке страницы выполняем функцию initpage*/
$(function(){
  initPage();
});

/*проверяем, если есть токен, то выполняем дальше*/
function initPage(){

  if(token) {
    console.log('Ваш логин грузится');
    App.ProfilesControllerGet(token);
  } else {
    /*если нет токена, то открываем форму логина*/
    console.log('Вам тут не рады');
    showLogin();
  }
}

/*открываем формочку логина*/
function showLogin(){
  $('.login').show();
}

/*форма логина*/
var capsLockEnabled = null;

function getChar(event) {
  if (event.which == null) {
    if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode) // IE
      }

      if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which) // остальные
      }
      return null; // специальная клавиша
    }
    if (navigator.platform.substr(0, 3) != 'Mac') { // событие для CapsLock глючит под Mac
      document.onkeydown = function(e) {
        if (e.keyCode == 20 && capsLockEnabled !== null) {
          capsLockEnabled = !capsLockEnabled;
        }
      }
    }

    document.onkeypress = function(e) {
      e = e || event;
      var chr = getChar(e);
      if (!chr) return // special key
       if (chr.toLowerCase() == chr.toUpperCase()) {
        // символ, не зависящий от регистра, например пробел не может быть использован для определения CapsLock
        return;
      }
      capsLockEnabled = (chr.toLowerCase() == chr && e.shiftKey) || (chr.toUpperCase() == chr && !e.shiftKey);
    }

    /**
     * Проверить CapsLock
     */

     function checkCapsWarning() {
      document.getElementById('capsIndicator').style.display = capsLockEnabled ? 'block' : 'none';
    }

    function removeCapsWarning() {
      document.getElementById('capsIndicator').style.display = 'none';
    }

    function validateNameLogin(){
      if ($('#loginLogin').val() ===''){
       $(document.getElementById('loginLogin')).after('<p>Вы не ввели значение<p>');
       $('#formLogin>p').addClass('error');
       return false;
     }
     else if($('#loginLogin').val().length<6){
       $(document.getElementById('loginLogin')).after('<p>Количество символов меньше допустимого<p>');
       $('#formLogin>p').addClass('error');
       return false;
     }
     return true;

   };

   function validatePasswordLogin(){
    if ($('#passwordLogin').val() ===''){
     $(document.getElementById('passwordLogin')).after('<p>Вы не ввели значение<p>');
     $('#formLogin>p').addClass('error');
     return false;
   }
   else if($('#passwordLogin').val().length<6){
     $(document.getElementById('passwordLogin')).after('<p>Количество символов меньше допустимого<p>');
     $('#formLogin>p').addClass('error');
     return false;
   }
   return true;
 };


 // document.querySelector("#buttonLogin").addEventListener("click", validateNameLogin);
 // document.querySelector("#buttonLogin").addEventListener("click", validatePasswordLogin);


 /*в форме логина делаем запрос на сервер про наши данные, если они есть, то пропускает нас дальше*/
 function login() {

  $.ajax({
   url: 'http://restapi.fintegro.com/login',
   method: 'POST',
   dataType: 'json',
   data: {
    username: $('#loginLogin').val(), 
    password: $('#passwordLogin').val()
  },
  success: function (data) { 
    console.log(data);
    localStorage.setItem('token', data.token);
    // sessionStorage.sessionToken = data.token;
    window.location.href = "header.html";

  },
  beforeSend: function () {
    console.log('Loading...');
  },
  error: function (xhr, status, error) {
    $('body').append('вашего логина не существует');
    console.log('вашего логина не существует', xhr, status, error);
  }
});
};

$('#buttonLogin').click(function(){
  $("#formLogin>p.error").remove();
  if(validateNameLogin()&&validatePasswordLogin()){
    login();
  }
})
/*конец форма логина*/

/*форма регистрации*/

function randomNumber(m,n){  // функция для генерации случайных чисел в диапазоне от m до n
  m = parseInt(m);
  n = parseInt(n);
  return Math.floor( Math.random() * (n - m + 1) ) + m;
};


function capcha(){
  var newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.id='capcha';
  formRegistration.insertBefore(newInput, formRegistration.lastChild);

        var A = randomNumber(1,100); // генерируем число
        var B = randomNumber(1,100); // генерируем число
        var sumAB = A + B;  // вычисляем сумму
        document.getElementById('capcha').placeholder = 'Сколько будет'+' ' + A + ' + ' + B + ' ? ';  // показываем пользователю выражение

        $('#capcha').keyup(function(event){
          event = event || window.event;
          if (event.keyCode === 13) {
            var Value = $('#capcha').val();
            console.log(sumAB);
            console.log(Value);

            if (Value==sumAB){
               // $('button').removeAttr("disabled");
               $('#capcha').remove().fadeOut(400);
               console.log('pravda');
               $('.modal.ErrorValue').fadeOut(600); 
               // return true;
               showSuccess();
               registration();
             }
             else if (Value!==sumAB){
              showErrorValue();
              console.log('Вы не умеете считать');
              return false;  
            }
          }
          // return false;  
        });
      };


      function validateName(){
        if ($('#loginRegistration').val() ===''){
         $(document.getElementById('loginRegistration')).after('<p>Вы не ввели значение<p>');
         $('#formRegistration>p').addClass('error');
         return false;
       }
       else if($('#loginRegistration').val().length<6){
         $(document.getElementById('loginRegistration')).after('<p>Количество символов меньше допустимого<p>');
         $('#formRegistration>p').addClass('error');
         return false;
       }
       return true;
     };


     function validateEmail(){
      var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
      if($('#emailRegistration').val() === ''){
        $(document.getElementById('emailRegistration')).after('<p>Вы не ввели значение<p>');
        $('#formRegistration>p').addClass('error');
        return false;
      }
      else if($('#emailRegistration').val().search(pattern) !== 0){
       $(document.getElementById('emailRegistration')).after('<p>Ваш email не корректен!<p>');
       $('#formRegistration>p').addClass('error');
       return false;
     }
     return true;
   };



   function validatePassword(){
    if ($('#passwordRegistration').val() ===''){
     $(document.getElementById('passwordRegistration')).after('<p>Вы не ввели значение<p>');
     $('#formRegistration>p').addClass('error');
     return false;
   }
   else if($('#passwordRegistration').val().length<6){
     $(document.getElementById('passwordRegistration')).after('<p>Количество символов меньше допустимого<p>');
     $('#formRegistration>p').addClass('error');
     return false;
   }
   return true;
 };


 function validateRepeatPassword(){
  if ($('#repeatPasswordRegistration').val() ===''){
   $(document.getElementById('repeatPasswordRegistration')).after('<p>Вы не ввели значение<p>');
   $('#formRegistration>p').addClass('error');
   return false;
 }
 else if($('#repeatPasswordRegistration').val()!==($('#passwordRegistration').val())){
   $(document.getElementById('repeatPasswordRegistration')).after('<p>Ваши пароли не совпадают<p>');
   $('#formRegistration>p').addClass('error');
   return false;
 }
 else{
  return true;
}
};



/*показывает ошибку, если было введено неверное значение в капчу*/
function showErrorValue(){
  $('body').append('<div class="modal ErrorValue">Wrong </div>');
}

/*регистрация прошла успешно*/
function showSuccess(){
 $('body').append('<div class="modal Success">Регистрация прошла успешно </div>');
 $('.modal.Success').fadeIn(1000).delay(3000).fadeOut(1000, function(){$(this).remove()});
}


/*при открытой формочке регистрации отправляем данные на сервер*/
function registration() {
 $.ajax({
   url: 'http://restapi.fintegro.com/registration',
   method: 'POST',
   dataType: 'json',
   data: {
    firstname: $('#firstnameRegistration').val(),
    lastname:$('#lastnameRegistration').val(),
    login:$('#loginRegistration').val(),
    email:$('#emailRegistration').val(),
    password:$('#passwordRegistration').val()
  },
  success: function (data) {
   console.log(data.id);
   console.log('все прошло нормально');
      // localStorage.setItem('token', data.token);
      setTimeout(function() {
        window.location.href = "index.html";
      }, 100);
    },
    beforeSend: function () {
      console.log('Loading...');
    },
    error: function (xhr, status, error) {
     console.log('ERROR!!!', xhr, status, error);
   }
 });
}

// document.querySelector("#buttonRegistration").addEventListener("click", validateName);
// document.querySelector("#buttonRegistration").addEventListener("click", validateEmail);
// document.querySelector("#buttonRegistration").addEventListener("click", validatePassword);
// document.querySelector("#buttonRegistration").addEventListener("click", validateRepeatPassword);
// document.querySelector("#buttonRegistration").addEventListener("click", capcha);

$('#buttonRegistration').click(function(){
 $("#formRegistration>p.error").remove();
 $('#capcha').remove();
 if(validateName()&&validateEmail()&&validatePassword()&&validateRepeatPassword()){
  if(capcha()){
    console.log('данные заполнены');
  }
}
});
/*конец форма регистрации*/


/*форма восстановить пароль*/


// function ReestablishEmail(){
//  $('body').append('<div class="ReestablishEmail">На Ваш email отправлен пароль </div>');
//  $('.ReestablishEmail').fadeIn(600).delay(600).fadeOut(100, function(){$(this).remove()});
//  document.getElementById("emailEmail").value = "";

// }

function validateEmailEmail(){
  var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;

  if($('#emailEmail').val() === ''){
    $(document.getElementById('emailEmail')).after('<p>Вы не ввели значение<p>');
    $('#formEmail>p').addClass('error');
    return false;
  }
  else if($('#emailEmail').val().search(pattern) !== 0){
   $(document.getElementById('emailEmail')).after('<p>Ваш email не корректен!<p>');
   $('#formEmail>p').addClass('error');
   return false;
 }
 return true;
};


/*отправляем пароль на email*/ /*еще не работает*/

function resetPassword() {
 $.ajax({
   url: 'http://restapi.fintegro.com/recovery',
   method: 'POST',
   dataType: 'json',
   data: {
     email:$('#emailEmail').val() 
   },
   success: function (data) { 
     $('body').append('<div class="ReestablishEmail">На Ваш email отправлен пароль </div>');
     $('.ReestablishEmail').fadeIn(600).delay(600).fadeOut(100, function(){$(this).remove()});
     document.getElementById("emailEmail").value = "";
   },
   error: function (xhr, status, error) {
    console.log('вашего логина не существует', xhr, status, error);
  }
});
};



$('#buttonReestablish').click(function(){
 if(validateEmailEmail()){
  resetPassword();
  // ReestablishEmail();
}

setTimeout(function() {
 $('.LoginForm.email').css({
  'display': 'none'
})
 $('.LoginForm.login').css({
  'display': 'block'
})
}, 1000);
})



/*конец форма восстановить пароль*/


/*связи с сервером*/
var App= {

 ProfilesControllerGet: function(){

  $.ajax({
   url: 'http://restapi.fintegro.com/profiles',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   success: function (data) {
     // console.log(data);
     localStorage.setItem('user_id', data.profile.id);
     $('.firstname').html(data.profile.firstname);
     $('.lastname').html(data.profile.lastname);
     $('.quote').html(data.profile.quote);
     $('.userPhotoMini').attr('src', data.profile.photo);
     $('.went').html( data.profile.went);
     $('.lived').html( data.profile.lived);
     $('.from').html(data.profile.from);
     $('.count__friends').html(data.friends_count);
     $('.count__enemies').html(data.enemies_count);

     /*данные со страницы редактирования профиля*/
     $('.profile__firstname').html(data.profile.firstname);
     $('.profile__lastname').html(data.profile.lastname);
     $('input.firstname').val(data.profile.firstname);
     $('input.lastname').val(data.profile.lastname);
     $('.userPhotoMini').attr('src', data.profile.photo);
    // $('.userPhotoMini').html('<img src="' + data.profile.photo +'">');
    $('input.quote').val( data.profile.quote);
    $('input.went').val( data.profile.went);
    $('input.lived').val( data.profile.lived);
    $('input.from').val(data.profile.from);

     //  /*добавляем наших друзей справа сверху в список*/
     $('.friends__list').children().remove();
     $('.search__allFriends').children().remove();

     /*если количество друзей не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
     if(data.friends_count!==0){
      $('.friends__list__item.empty').css({
        'display':'none'
      });

      /*проходим массивом по результатам поиска*/
      for (var i=0; i<data.friends.length; i++) {
        var friends = data.friends[i];
        yourFriends(friends.id,friends.lastname,friends.firstname,friends.quote,friends.photo, friends.lived, friends.from, friends.went);
        // if($(document).find('.modalFriends')){
        //   allYourFriends(friends.id,friends.lastname,friends.firstname,friends.quote,friends.photo, friends.lived, friends.from, friends.went);
        // }

        // проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото
        if(typeof friends.photo == 'object'){
          $('.friends__logo>img').attr('src', '../img/no-image-user.jpg')
        }
        else if(typeof friends.photo == ''){
         $('friends__logo>img').attr('src', '../img/no-image-user.jpg')
       }
     };
   }
   /*если нет друзей, то показываем блок с информацией, что друзей  у нас нет*/
   else if(data.friends.length==0){
    $('.friends__list__item.empty').css({
      'display':'block'
    });
    $('.friends__list__item.empty').html('У вас еще нет друзей');
  };
},
error: function (xhr, status, error) {
 console.log('ERROR!!!', xhr, status, error);
}
});

},





ProfileControllerGet:  function(token){

  console.log(id);
  $.ajax({
   url: 'http://restapi.fintegro.com/profiles/' + id +' ',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   success: function (data) {
    console.log(data);
  },
  error: function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},



/*Добавление файлов*/
UploadController:  function(token){
  var form = new FormData();
  form.append('UploadForm[imageFile]', ($('#profilePhoto')[0].files[0]));

  $.ajax({
   url: 'http://restapi.fintegro.com/upload',
   method: 'POST',
   crossDomain:true,
   cache:false,
   contentType:false,
   processData:false,
   headers: {
     bearer: token
   },
   data: form,
   success: function (data) {
        // $('.userPhotoMini').attr('src', data.link);
        globalPhoto = data.link;
        console.log($('#profilePhoto')[0].files[0]);
        console.log( data.link);
      },
      error: function (xhr, status, error) {
       console.log('ERROR!!!', [arguments]);
     }
   });
},


/*Добавление файлов*/
// UploadController:  function(token){
//   var form = new FormData();
//   form.append('UploadForm[imageFile]', ($('#profilePhoto')[0].files[0]));
//   // form.append('UploadForm[imageFile]', ($('#NewPhoto')[0].files[0]));

//   $.ajax({
//    url: 'http://restapi.fintegro.com/upload',
//    method: 'POST',
//    crossDomain:true,
//    cache:false,
//    contentType:false,
//    processData:false,
//    headers: {
//      bearer: token
//    },
//    data: form,
//    success: function (data) {
//         // $('.userPhotoMini').attr('src', data.link);
//         globalPhoto = data.link;
//         // NewPhoto = data.link;
//         // console.log($('#NewPhoto')[0].files[0]);
//         console.log($('#profilePhoto')[0].files[0]);
//         console.log( data.link);
//       },
//       error: function (xhr, status, error) {
//        console.log('ERROR!!!', [arguments]);
//      }
//    });
// },

/*обновление профайла*/
ProfileControllerPut: function(token){

  $.ajax({
   url: 'http://restapi.fintegro.com/profiles/' + id +' ',
   method: 'PUT',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data: {
     lastname: $('#lastname').val(),
     firstname: $('#firstname').val(),
     photo:globalPhoto,
     quote: $('#quote').val(),
     lived: $('#lived').val(),
     from:  $('#from').val(),
     went: $('#went').val()
   },
   success: function (data) {
    console.log(data);
    console.log(data.link);
    // $('.userPhotoMini').attr('src', data.link);
    console.log($('.userPhotoMini').attr('src'));
    App.ProfilesControllerGet(localStorage.getItem('token'));
    console.log(globalPhoto);
  },
  error: function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},

/*удаление профайла* /*не работает*/
ProfileControllerDelete: function(token, id){

  $.ajax({
   url: 'http://restapi.fintegro.com/profiles/' + id +' ',
   method: 'DELETE',
   dataType: 'json',
   headers: {
     bearer: token
   },
   success: function (data) {
    console.log(data);
    localStorage.clear();
    // delete window.localStorage.token;
    // delete window.localStorage.user_id;
    //  delete window.sessionStorage.sessionToken;
    // sessionStorage.clear();
    window.location.href = "index.html";
    // console.log('204');

  },
  error: function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});

},
/*Друзья враги*/

UserFriendsEnemies: function(token){
 $.ajax({
   url: 'http://restapi.fintegro.com/social-activities',
   method: 'GET',
   dataType: 'json',

   headers: {
     bearer: token
   },
   success: function(data){
    console.log(data);
    /*удаляем другие результаты поиска*/



//     $('.search__result--found--Friends').children().remove();

//     /*если количество результатов поиска не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
//     if(data.friends.length!==0){
//     // $('.search__result--empty').css({
//     //   'display':'none'
//     // });

//     // allYourFriendsEnemiesModal();
//     /*проходим массивом по результатам поиска*/
//     for (var i=0; i<data.friends.length; i++) {
//       var friends = data.friends[i];
//       allYourFriends(friends.id,friends.lastname,friends.firstname,friends.quote,friends.photo, friends.lived, friends.from, friends.went);
//       console.log(data.friends[i]);
//       /*проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото*/
//       if(typeof friends.photo == 'object'){
//         $('.search__allFriends--avatar>img').attr('src', '../img/no-image-user.jpg')
//       }
//       else if(typeof friends.photo == ''){
//        $('.search__allFriends--avatar>img').attr('src', '../img/no-image-user.jpg')
//      }
//    };
//  }
//  /*если нет друзей, то показываем блок о том, что у нас нет друзей*/
//  else if(data.friends.length==0){
//   $('.friends__list__item.empty').css({'display': 'block'})
//   $('.friends__list__item.empty').text('У вас еще нет друзей');
//   $('.search__result--found--Friends').text('У вас еще нет друзей');
//    // allYourFriendsModal();
//    // $('.search__result--found--EnemiesFriends').text('У вас еще нет друзей');
//  };

//  /*если количество результатов поиска не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
//     if(data.enemies.length!==0){
//     // $('.search__result--empty').css({
//     //   'display':'none'
//     // });

//     // allYourFriendsEnemiesModal();

// $('.search__result--found--Enemies').children().remove();
//     /*проходим массивом по результатам поиска*/
//     for (var i=0; i<data.enemies.length; i++) {
//       var enemies = data.enemies[i];
//       allYourEnemies(enemies.id,enemies.lastname,enemies.firstname,enemies.quote,enemies.photo, enemies.lived, enemies.from, enemies.went);
//       /*проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото*/
//       if(typeof enemies.photo == 'object'){
//         $('.search__allEnemies--avatar>img').attr('src', '../img/no-image-user.jpg')
//       }
//       else if(typeof enemies.photo == ''){
//        $('.search__allEnemies--avatar>img').attr('src', '../img/no-image-user.jpg')
//      }
//    };
//  }

//  /*если нет друзей, то показываем блок о том, что у нас нет друзей*/
//  else if(data.enemies.length==0){
//   allYourEnemiesModal();
//   $('.search__result--found--Enemies').text('У вас еще нет врагов');
// }

},
error: function(data){
  console.log('ERROR!!!', xhr, status, error);
}
});
},

/*информация про друзей/врагов, которую мы выводим*/
UserFriendsId: function(token){

 $.ajax({
   url: 'http://restapi.fintegro.com/social-activities/' + id + ' ',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   success: function(data){
    console.log(data);
    /*удаляем другие результаты поиска*/
    $('.search__result--found--Friends').children().remove();

    /*если количество результатов поиска не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
    if(data.friends.length!==0){
    // $('.search__result--empty').css({
    //   'display':'none'
    // });

    // allYourFriendsEnemiesModal();
    /*проходим массивом по результатам поиска*/
    for (var i=0; i<data.friends.length; i++) {
      var friends = data.friends[i];
      allYourFriends(friends.id,friends.lastname,friends.firstname,friends.quote,friends.photo, friends.lived, friends.from, friends.went);
      console.log(data.friends[i]);
      /*проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото*/
      if(typeof friends.photo == 'object'){
        $('.search__allFriends--avatar>img').attr('src', '../img/no-image-user.jpg')
      }
      else if(typeof friends.photo == ''){
       $('.search__allFriends--avatar>img').attr('src', '../img/no-image-user.jpg')
     }
   };
 }
 /*если нет друзей, то показываем блок о том, что у нас нет друзей*/
 else if(data.friends.length==0){
  $('.friends__list__item.empty').css({'display': 'block'})
   // allYourFriendsModal();
   $('.search__result--found--Friends').text('У вас еще нет друзей');
   $('.search__result--found--Friends').css({
    'padding' : '20px',
    'fontSize' : '20px'
  })
 }
},
error: function(data){
  console.log('ERROR!!!', xhr, status, error);
}
});
},



/*информация про друзей/врагов, которую мы выводим*/
UserEnemiesId: function(token){

 $.ajax({
   url: 'http://restapi.fintegro.com/social-activities/' + id + ' ',
   method: 'GET',
   dataType: 'json',

   headers: {
     bearer: token
   },
   success: function(data){
    console.log(data);

    /*удаляем другие результаты поиска*/
    $('.search__result--found--Enemies').children().remove();

    /*если количество результатов поиска не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
    if(data.enemies.length!==0){
    // $('.search__result--empty').css({
    //   'display':'none'
    // });

    // allYourFriendsEnemiesModal();

    /*проходим массивом по результатам поиска*/
    for (var i=0; i<data.enemies.length; i++) {
      var enemies = data.enemies[i];
      allYourEnemies(enemies.id,enemies.lastname,enemies.firstname,enemies.quote,enemies.photo, enemies.lived, enemies.from, enemies.went);
      // проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото
      if(typeof enemies.photo == 'object'){
        $('.search__allEnemies--avatar>img').attr('src', '../img/no-image-user.jpg')
      }
      else if(typeof enemies.photo == ''){
       $('.search__allEnemies--avatar>img').attr('src', '../img/no-image-user.jpg')
     }
   };
 }

 /*если нет друзей, то показываем блок о том, что у нас нет друзей*/
 else if(data.enemies.length==0){
  $('.search__result--found--Enemies').text('У вас еще нет врагов');
  $('.search__result--found--Enemies').css({
    'padding' : '20px',
    'fontSize' : '20px'
  })
}
},
error: function(data){
  console.log('ERROR!!!', xhr, status, error);
}
});
},


/*Добавление в друзья либо же во враги*/
UserFriendsAddBlock: function(token, userId, type){
 $.ajax({
   url: 'http://restapi.fintegro.com/social-activities',
   method: 'POST',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data: {
    user_id: userId,
    type: type
  },
  success: function(data){
    console.log(data);
    // $('.friends__list').children().remove();/*добавила*/
    App.ProfilesControllerGet(token);/*добавила*/
    App.UserFriendsId(token);
    App.UserEnemiesId(token);
    // App.Search(token);/*добавила*/
  },
  error: function(data){
    console.log('ERROR!!!', xhr, status, error);
  }
});
},






// /*Добавление в друзья либо же во враги*/
// UserFriendsAdd: function(token, userId, type){
//  $.ajax({
//    url: 'http://restapi.fintegro.com/social-activities',
//    method: 'POST',
//    dataType: 'json',
//    headers: {
//      bearer: token
//    },
//    data: {
//     user_id: userId,
//     type: type
//   },
//   success: function(data){
//     console.log(data);
//     // $('.friends__list').children().remove();/*добавила*/
//     App.ProfilesControllerGet(token);/*добавила*/

//     // App.Search(token);/*добавила*/
//   },
//   error: function(data){
//     console.log('ERROR!!!', xhr, status, error);
//   }
// });
// },

// // Добавление в друзья либо же во враги
// UserFriendsBlock: function(token, userId, type){
//  $.ajax({
//    url: 'http://restapi.fintegro.com/social-activities',
//    method: 'POST',
//    dataType: 'json',
//    headers: {
//      bearer: token
//    },
//    data: {
//     user_id: userId,
//     type: type
//   },
//   success: function(data){
//     console.log(data);
//     // $('.friends__list').children().remove();/*добавила*/

//     // $('.search__allFriends').children().remove();
//     App.ProfilesControllerGet(token);/*добавила*/
//     App.UserFriendsId(token);
//   },
//   error: function(data){
//     console.log('ERROR!!!', xhr, status, error);
//   }
// });
// },



// UserFriendsEnemiesDelete: function(token, userID){
//  $.ajax({
//    url: 'http://restapi.fintegro.com/social-activities/' + userID,
//    method: 'DELETE',
//    dataType: 'json',

//    headers: {
//      bearer: token
//    },

//    success: function(data){
//     console.log(data);
//     // $('.friends__list').children().remove(); /*добавила*/
//     App.ProfilesControllerGet(token); /*добавила*/
//     App.UserFriendsEnemiesId(token);
//     // App.UserFriendsId(token);
//     // App.UserEnemiesId(token);
//   },
//   error: function(data){
//     console.log('ERROR!!!', xhr, status, error);
//   }
// });
// },




UserFriendsEnemiesDelete: function(token, userID){
 $.ajax({
   url: 'http://restapi.fintegro.com/social-activities/' + userID,
   method: 'DELETE',
   dataType: 'json',

   headers: {
     bearer: token
   },

   success: function(data){
    console.log(data);
    // $('.search__result--found--Enemies').children().remove(); /*добавила*/
    App.ProfilesControllerGet(token); /*добавила*/
    App.UserFriendsId(token);
    App.UserEnemiesId(token);
  },
  error: function(data){
    console.log('ERROR!!!', xhr, status, error);
  }
});
},







// UserFriendsDelete: function(token, userID){
//  $.ajax({
//    url: 'http://restapi.fintegro.com/social-activities/' + userID,
//    method: 'DELETE',
//    dataType: 'json',

//    headers: {
//      bearer: token
//    },

//    success: function(data){
//     console.log(data);
//     // $('.search__result--found--Enemies').children().remove(); /*добавила*/
//     App.ProfilesControllerGet(token); /*добавила*/
//     App.UserFriendsId(token);
//     // App.UserEnemiesId(token);
//   },
//   error: function(data){
//     console.log('ERROR!!!', xhr, status, error);
//   }
// });
// },

// UserEnemiesDelete: function(token, userID){
//  $.ajax({
//    url: 'http://restapi.fintegro.com/social-activities/' + userID,
//    method: 'DELETE',
//    dataType: 'json',
//    headers: {
//      bearer: token
//    },
//    success: function(data){
//     console.log(data);
//     // $('.friends__list').children().remove(); /*добавила*/
//     // $('.search__result--found--Enemies').children().remove(); /*добавила*/
//     App.ProfilesControllerGet(token); /*добавила*/
//     App.UserEnemiesId(token);
//   },
//   error: function(data){
//     console.log('ERROR!!!', xhr, status, error);
//   }
// });
// },

/*поиск по пользователям*/
Search: function(token){
  $.ajax({
   url: 'http://restapi.fintegro.com/search',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data:{
     search:$('.Search').val(),
     limit:1000,
     page:1,
   },

   success: function (data) {
    console.log(data);

    /*убираем блок, где пишется сообщение*/
    $('.wall__list__item.message').css({
     'display': 'none'
   });
    /*убираем блок, где вводится сообщение*/
    $('.input-group').css({
     'display': 'none'
   });
    // оказываем блок, в который будут вставляться результаты поиска
    $('.wall__list__item.search').css({
      'display': 'block'
    });

    /*удаляем из поиска другие результаты поиска*/
    $('.search__result--found').children().remove();

    /*если количество результатов поиска не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
    if(data.profiles.length!==0){
      $('.search__result--empty').css({
       'display':'none'
     });

      /*проходим массивом по результатам поиска*/
      for (var i=0; i<data.profiles.length; i++) {
        // for (var i=0; i<1; i++) {
          var profile = data.profiles[i];
          newSearch(profile.id,profile.lastname,profile.firstname,profile.quote,profile.photo, profile.lived, profile.from, profile.went);

          if(profile.friend == true){
            console.log('dryg');
            console.log($(['data-user-id="'+ profile.id +'"']));


            // var thisprofile = $(['data-user-id="'+ profile.id +'"']);
            // if( $(thisprofile).find($('button.found--item--follow'))){
            //  $(thisprofile).find($('button.found--item--follow')).remove();
            //   console.log('nashel');
            // }



            // console.log(profile.id);
            // $('button.found--item--follow').remove();
            // var modalBlock = document.createElement('button');
            // var i = document.createElement('i');
            // $(i).addClass('icon fa fa-user-secret');
            // $(modalBlock).addClass('found--item--block');
            // $(modalBlock).append(i, 'Block');
            // $('.found--item--buttons').append(modalBlock);
          }
          else {

            console.log('ne dryg');
            console.log(profile.id);
            // $('button.found--item--unfollow').remove();
            // var modalBlock = document.createElement('button');
            // var i = document.createElement('i');
            // $(i).addClass('icon fa fa-user-secret');
            // $(modalBlock).addClass('found--item--block');
            // $(modalBlock).append(i, 'Block');
            // $('.found--item--buttons').append(modalBlock);

          };

          /*проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото*/
          if(typeof profile.photo == 'object'){
            $('.found--item--avatar>img').attr('src', '../img/no-image-user.jpg')
          }
          else if(typeof profile.photo == ''){
           $('.found--item--avatar>img').attr('src', '../img/no-image-user.jpg')
         };
       };
     }
     else if(data.profiles.length==0){
      $('.search__result--empty').css({
        'display':'block'
      });
    };
  },
  error: function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},


/*Task 8 Album controller*/

AlbumController: function(token){
  $.ajax({
   url: 'http://restapi.fintegro.com/albums',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data:{
    user_id:id
  },
  success: function (data) {

    console.log(data);

    // localStorage.setItem('albums_id', data.albums.id);
    $('#albums').children().remove();
    /*если количество альбомов не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
    if(data.albums.length!==0){
      $('.album-item-empty').css({
        'display':'none'
      });

      /*проходим массивом по результатам поиска*/
      for(var i=0;i<data.albums.length;i++){
        var albums = data.albums[i];
        albums_id=data.albums[i].id;
        AllAlbums(albums.id,albums.name,albums.created,albums.photos);

        // проверяем есть ли фото, если нету или формат не соответствует, то подгружаем стандартное фото
        if(albums.photos.length!== 0){
          console.log(albums.photos.length);
          console.log(albums.photos[0].url);
          $('.albums__list__item').eq(i).css({
            'backgroundImage': 'url(' + albums.photos[0].url+ ')',
            'backgroundSize': 'cover'
          });
        }

        else if(albums.photos.length === 0){
         console.log(albums.photos.length);
         $('.albums__list__item').eq(i).css('backgroundImage', 'url(../img/no-image.png)');
       }

     };
   }

   /*если нет альбомов, то показываем блок с информацией, что альбомов  у нас нет*/
   else if(data.albums.length==0){
    console.log('У вас еще нет альбомов');
    $('.album-item-empty').css('display', 'block');
  };

    //   // albums_id=data.albums[i].id;
    //   // console.log(albums_id);
    //   // albums_name=data.albums[i].name;
    //   // console.log(albums_name);

  }, 
  error:function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},

AlbumControllerID: function(token, albumID){
  // var albums_id = data.albums.id;
  // console.log(albums_id);
  $.ajax({
   url: 'http://restapi.fintegro.com/albums/' + albumID,
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   success: function (data) {
    console.log(data);
    App.AlbumController(token);

  }, 
  error:function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},


AlbumControllerPost: function(token){
  console.log('2', $('#newElemInput').val());
  $.ajax({
   url: 'http://restapi.fintegro.com/albums',
   method: 'POST',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data: {
    name:$('#newElemInput').val()
  },

  success: function (data) {
    console.log(data);
    App.AlbumController(token);
  }, 
  error:function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},

AlbumControllerDelete: function(token, albumID){
  $.ajax({
   url: 'http://restapi.fintegro.com/albums/'+ albumID,
   method: 'DELETE',
   dataType: 'json',
   headers: {
     bearer: token
   },
   success: function (data) {
    App.AlbumController(token);
 // console.log(data.albums[0].id);

}, 
error:function (xhr, status, error) {
 console.log('ERROR!!!', xhr, status, error);
}
});
},


PhotoController: function(token, albumID){
  $.ajax({
   url: 'http://restapi.fintegro.com/photos',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data: {
    album_id:albumID
  },
  success: function (data) {
    console.log(data);
    $('#photos').children().remove();
    /*если количество альбомов не 0, то убираем пустой элемент с текстом, что ничего не найдено*/
    if(data.photos.length!==0){
      $('.photo-item-empty').css({
        'display':'none'
      });

      /*проходим массивом по результатам поиска*/
      for(var i=0;i<data.photos.length;i++){
        var photos = data.photos[i];
        photos_id=data.photos[i].id;
        // console.log(albums_id);
        AllPhotos(photos.id,photos.url,photos.created);
       
      };
    }
    /*если нет альбомов, то показываем блок с информацией, что альбомов  у нас нет*/
    else if(data.photos.length==0){
      console.log('У вас еще нет фото');
      var divEmptyAlbum = document.createElement('div');
      $('#photos').append(divEmptyAlbum);
      $(divEmptyAlbum).css({
        'textAlign' : 'center',
        'fontSize' : '20px'
      });
      $(divEmptyAlbum).text('У вас еще нет фото');
    };
  }, 
  error:function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},

PhotoControllerID: function(token, photoID){
  $.ajax({
   url: 'http://restapi.fintegro.com/photos/' + photoID,
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },

   success: function (data) {
    console.log(data);
    // App.PhotoController(token);
    /*проходим массивом по результатам поиска*/

        BigPhotos(data.photo.id,data.photo.url,data.photo.created);
 
  }, 
  error:function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},



// UploadControllerPhoto:  function(token){
//   var formm = new FormData();
//   formm.append('UploadForm[imageFile]', ($('#NewPhoto')[0].files[0]));

//   $.ajax({
//    url: 'http://restapi.fintegro.com/upload',
//    method: 'POST',
//    crossDomain:true,
//    cache:false,
//    contentType:false,
//    processData:false,
//    headers: {
//      bearer: token
//    },
//    data: formm,
//    success: function (data) {

//         NewPhoto = data.link;
//         console.log($('#NewPhoto')[0].files[0]);
//         console.log( data.link);
//       },
//       error: function (xhr, status, error) {
//        console.log('ERROR!!!', [arguments]);
//      }
//    });
// },






PhotoControllerPost: function(token, albumID){
  $.ajax({
   url: 'http://restapi.fintegro.com/photos',
   method: 'GET',
   dataType: 'json',
   headers: {
     bearer: token
   },
   data: {
    album_id:albumID,
    url:globalPhoto
  },
  success: function (data) {
    // App.UploadController(token);
    console.log(data);
    console.log(NewPhoto);

  }, 
  error:function (xhr, status, error) {
   console.log('ERROR!!!', xhr, status, error);
 }
});
},







};






// function nameAlbum(){

// $('#newElemInput').keyup(function(event){
//           event = event || window.event;
//           if (event.keyCode === 9) {
//             Value = $('#newElemInput').val();
//             console.log(Value);
// };
// });
// };



/*модальное окно про друзей и врагов*/

function allYourFriendsModal(){
  $('.modal-overlay').remove();
  $('.modalFriends').remove();
  var overlay = document.createElement('div');
  var modalContainer = document.createElement('div');
  var modalTitle = document.createElement('div');
  var modalClose = document.createElement('a');
  var modalItems = document.createElement('div');

  $(modalItems)
  .addClass('search__result--found--Friends');

  $(modalClose)
  .attr('href', '#')
  .text('x')
  .addClass('modal-close');

  $(modalTitle)
  .addClass('modal-title')
  .text('Your Friends')
  .append(modalClose);

  $(modalContainer)
  .addClass('modalFriends')
  .append(modalTitle, modalItems);

  $(overlay).addClass('modal-overlay')
  .append(modalContainer);

  $('script:last-of-type').after(overlay);

  $('.modal-close').click(function(){
    $('.modalFriends').remove();
    $('.modal-overlay').remove();
  });

};


function allYourEnemiesModal(){
  $('.modal-overlay').remove();
  $('.modalEnemies').remove();
  var overlay = document.createElement('div');
  var modalContainer = document.createElement('div');
  var modalTitle = document.createElement('div');
  var modalClose = document.createElement('a');
  var modalItems = document.createElement('div');

  $(modalItems)
  .addClass('search__result--found--Enemies');

  $(modalClose)
  .attr('href', '#')
  .text('x')
  .addClass('modal-close');

  $(modalTitle)
  .addClass('modal-title')
  .text('Your Enemies')
  .append(modalClose);

  $(modalContainer)
  .addClass('modalEnemies')
  .append(modalTitle, modalItems);

  $(overlay).addClass('modal-overlay')
  .append(modalContainer);

  $('script:last-of-type').after(overlay);

  $('.modal-close').click(function(){
    $('.modalEnemies').remove();
    $('.modal-overlay').remove();
  });

};

/*функция по поиску и выводу результатов*/
function newSearch(id,lastname,firstname,quote,photo, lived, form, went, friend){

  $('.search__result--found').append('<div class="found--item" data-user-id="' + id + '">\
    <div class="found--item--bcg">\
    </div>\
    <div class="found--item--info">\
    <div class="found--item--avatar"><img src="' + photo + '"></div>\
    <div class="found--item--name" href="#">\
    <span class="found--item--firstname"> ' + firstname + '</span> \
    <span class="found--item--lastname"> ' + lastname + '</span>\
    </div>\
    <div class="found--item--quote"> ' + quote + '</div>\
    <div class="found--item--buttons">\
    <button class="found--item--follow">  <i class="icon  fa fa-user-plus"></i>Follow</button>\
    <button class="found--item--unfollow">  <i class="icon  fa fa-user-times"></i>Unfollow</button>\
    <button class="found--item--block" style="display:none">  <i class="icon fa fa-user-secret"></i>Block</button>\
    </div>\
    </div>\
    </div>\
    ');
}

/*функция по выводу информации про друзей*/
function allYourFriends(id,lastname,firstname,quote,photo, lived, form, went, friend){

  $('.search__result--found--Friends').append('<div class="search__allFriends" data-user-id="' + id + '">\
    <div class="search__allFriends--info">\
    <span class="search__allFriends--avatar"><img src="' + photo + '"></span>\
    <span class="search__allFriends--name" href="#">\
    <span class="search__allFriends--firstname"> ' + firstname + '</span> \
    <span class="search__allFriends--lastname"> ' + lastname + '</span>\
    </div>\
    <div class="search__allFriends--buttons">\
    <button class="search__allFriends--startChat">  <i class="icon  fa fa-user-plus"></i>Start chat</button>\
    <button class="search__allFriends--unfollow">  <i class="icon fa fa-user-times"></i>Unfollow</button>\
    <button class="search__allFriends--block">  <i class="icon fa fa-user-secret"></i>Block</button>\
    </div>\
    </div>\
    </div>\
    ');
}


/*функция по выводу информации про врагов*/
function allYourEnemies(id,lastname,firstname,quote,photo, lived, form, went, friend){

  $('.search__result--found--Enemies').append('<div class="search__allEnemies" data-user-id="' + id + '">\
    <div class="search__allEnemies--info">\
    <span class="search__allEnemies--avatar"><img src="' + photo + '"></span>\
    <span class="search__allEnemies--name" href="#">\
    <span class="search__allEnemies--firstname"> ' + firstname + '</span> \
    <span class="search__allEnemies--lastname"> ' + lastname + '</span>\
    </span>\
    </div>\
    <div class="search__allEnemies--buttons">\
    <button class="search__allEnemies--startChat">  <i class="icon  fa fa-user-plus"></i>Start chat</button>\
    <button class="search__allEnemies--unfollow">  <i class="icon fa fa-user-times"></i>Unfollow</button>\
    <button class="search__allEnemies--follow">  <i class="icon  fa fa-user-plus"></i>Follow</button>\
    </div>\
    </div>\
    ');
}


/*функция по выводу информации про друзей справа сверху*/
function yourFriends(id, lastname, firstname, quote, photo, lived, form, went, friend){
  $('.friends__list').append('<li class="friends__list__item followers" data-user-id="' + id + '">\
    <div class="container-fluid">\
    <div class="row">\
    <div class="friends__logo col-lg-3 col-md-3 col-sm-2 col-xs-2"> <img src=" ' + photo + ' "></div>\
    <div class="col-lg-9 col-md-9 col-sm-10 col-xs-10">\
    <div class="friends__list__item--info">\
    <a href="#" class="friends__name">   <span class="friends__firstname">' + firstname + ' </span><span class="friends__lastname">' + lastname + ' </span></a>\
    <div class="friends__buttons"> \
    <button class="friends__unfollow"><i class="icon fa fa-user-times"></i>Unfollow</button> <button class="friends__block"><i class="icon fa fa-user-secret"></i>Block</button></div>\
    </div>\
    </div>\
    </div>\
    </div>\
    </li>');
}






// /*функция по выводу информации про альбомы*/
// function AllAlbums(id, name, created, photos){
//   $('#albums').append('<li class="albums__list__item" data-album-id="' + id + '">\
//    <div class="albums__logo"> <img src=" ' + photos + ' "></div>\
//    <div class="albums__list__item--info">\
//    <a href="#" class="albums__name">  ' + name + ' <span class="albums__created">' + created + ' </span></a>\
//    </div>\
//    </li>');
// }

/*функция по выводу информации про альбомы*/
function AllAlbums(id, name, created, photos){
  $('#albums').append('<li class="albums__list__item" data-album-id="' + id + '">\
    <a href="#" class="albums__list__item--delete">x</a>\
    <div class="albums__list__item--info">\
    <a href="#" class="albums__name">  ' + name + ' <span class="albums__created">' + created + ' </span></a>\
    </li>');
}


/*функция по созданию нового альбома из модального окна*/
function createAlbumModal(){
  $('body').append('<div class="modal">\
    <div class="modal-title">New album<a href="#" class="modal-close">x</a></div>\
    <div class="modal-newElem">Album name:<input class="modal-newElemInput" id="newElemInput">\
    <button class="modal-edit" style="background-color: blue; color: rgb(255, 255, 255);">Create</button>\
    </div>\
    </div>');
}







// /*функция по выводу информации про фото*/
// function AllPhotos(id, url, created){
//   $('#photos').append('<li class="photo__item" data-photo-id="' + id + '">\
//    <div class="photos__logo"> <img src=" ' + url + ' "></div>\
//    <div class="photos__list__item--info">\
//    <a href="#" class="photos__name"><span class="photos__created">' + created + ' </span></a>\
//    </div>\
//    </li>');
// }

/*функция по выводу информации про фото*/
function AllPhotos(id, url, created){
  $('#photos').append('<li class="photo__item" data-photo-created="'+ created+'" data-photo-id="' + id + '">\
    <img src=" ' + url + ' ">');
}

/*функция по выводу фото поверх всего*/
function BigPhotos(id, url, created){
  $('body').append('<div class="overAll"> \
    <div data-photo-created="'+ created+'" data-photo-id="' + id + '"> <img src=" ' + url + ' "> </div></div>\
    ');
}








$('#profilePhoto').on('change', function(token){
 App.UploadController(localStorage.getItem('token'));
});

/*обновление информации профиля*/ /*работает*/
$('.button__submit').on('click', function(){
  App.ProfileControllerPut(token);
  // $('.userPhotoMini').attr('src', data.link);
  // App.UploadController(localStorage.getItem('token'));
})

/*удаление профиля*/ /*не работает*/
$('.remove-profile').on('click', function(){
  App.ProfileControllerDelete(token);
  delete window.localStorage.token;
  delete window.localStorage.user_id;
  // window.location.reload();
  window.location.href = "index.html";
});
/*конец удаление профиля*/

/*logout*/ /*работает*/
$('.logout').on('click', function(){
  console.log('Выполнен выход');
  logout();
  // delete window.localStorage.token;
  // delete window.localStorage.user_id;
  // window.location.href = "index.html";
});


function logout() {
  if( localStorage.token) {
    delete  localStorage.token;
        // window.location.reload();
        window.location.href = "index.html";
      }
      window.location.href = "index.html";
    };
    /*конец logout*/


    /*поиск*/
    $('body').on('submit', '.navbar-form', function(e){
      e.preventDefault();
      console.log($(this).serialize());
      App.Search(token);
      return false;
    });



    /*просмотр*/

    /*смотрим всех друзей*/
    $('body').on('click', '.view-all-friends', function(e){
      e.preventDefault();
      console.log($(this).serialize());
      // App.UserFriendsEnemies(token);
      allYourFriendsModal();
       // App.UserFriendsEnemies(token);

       App.UserFriendsId(token);
       return false;
     });

    /*смотрим всех друзей из левой части */
    $('body').on('click', '.count__friends', function(e){
      e.preventDefault();
      console.log($(this).serialize());
      allYourFriendsModal();
      // App.UserFriendsEnemies(token);
      App.UserFriendsId(token);
      return false;
    });

    /*смотрим всех врагов  из левой части*/
    $('body').on('click', '.count__enemies', function(e){
      e.preventDefault();
      console.log($(this).serialize());
      allYourEnemiesModal();
      // App.UserFriendsEnemies(token);
      App.UserEnemiesId(token);
      return false;
    });

    /*добавление в друзья*/

    /*добавляем друга из центральной области, когда открыт поиск*/
    $('body').on('click', '.found--item--follow', function(e){
      e.preventDefault();;
      var userID = $(this).closest('.found--item').attr('data-user-id');
      App.UserFriendsAddBlock(token, userID, 1);

      return false;
    });

    /*добавляем врвга из центральной области обратно в друзья, когда открыты враги*/
    $('body').on('click', '.search__allEnemies--follow', function(e){
      e.preventDefault();;
      var userID = $(this).closest('.search__allEnemies').attr('data-user-id');
      App.UserFriendsAddBlock(token, userID, 1);
        // App.UserFriendsEnemies(token);
        App.UserEnemiesId(token);
        return false;
      });

    /*добавление в блок*/

    /*добавляем врага  из правой части*/
    $('body').on('click', '.friends__block', function(e){
      e.preventDefault();
      var userID = $(this).closest('.followers').attr('data-user-id');
      App.UserFriendsAddBlock(token, userID, 2);
      return false;
    });

    /*добавляем врага из центральной области, если открыт список друзей*/
    $('body').on('click', '.search__allFriends--block', function(e){
      e.preventDefault();
      console.log('vrag');
      var userID = $(this).closest('.search__allFriends').attr('data-user-id');
      App.UserFriendsAddBlock(token, userID, 2);
      return false;
    });

    /*добавляем врага из центральной области, когда открыт поиск*/
    $('body').on('click', '.found--item--block', function(e){
      e.preventDefault();;
      var userID = $(this).closest('.found--item').attr('data-user-id');
      App.UserFriendsAddBlock(token, userID, 2);
      return false;
    });

    /*удаление*/

    /*удаление друга из модальной области, если открыт список друзей*/
    $('body').on('click', '.search__allFriends--unfollow', function(e){
      e.preventDefault();
      var userID = $(this).closest('.search__allFriends').attr('data-user-id');
      // App.UserFriendsDelete(token, userID);
      App.UserFriendsEnemiesDelete(token, userID);
      // App.UserFriendsDeleteCenterFriends(token, userID);
      // App.UserFriendsId(token);
      return false;

    });

    /*удаление врага из модальной области, если открыт список врагов*/
    $('body').on('click', '.search__allEnemies--unfollow', function(e){
      e.preventDefault();
      var userID = $(this).closest('.search__allEnemies').attr('data-user-id');
      // App.UserEnemiesDelete(token, userID);
      App.UserFriendsEnemiesDelete(token, userID);
      // App.UserFriendsDeleteCenterEnemies(token, userID);
      // App.UserEnemiesId(token);
      return false;
    });


    /*удаление друга из правой части*/
    $('body').on('click', '.friends__unfollow', function(e){
      e.preventDefault();
      var userID = $(this).closest('.followers').attr('data-user-id');
      // App.UserFriendsDelete(token, userID);
      App.UserFriendsEnemiesDelete(token, userID);
      return false;
    });


    /*удаление друга из центральной области, когда открыт поиск*/
    $('body').on('click', '.found--item--unfollow', function(e){
      e.preventDefault();;
      var userID = $(this).closest('.found--item').attr('data-user-id');
      App.UserFriendsEnemiesDelete(token, userID);
      // App.UserFriendsDelete(token, userID);
      return false;
    });


    











// $('#NewPhoto').on('change', function(token){
//  App.UploadController(token);
// });







$('body').on('click', '.nav-link__albums', function(e){
  e.preventDefault();;
  App.AlbumController(token);
  return false;
});

/*создаем новый альбом*/
$('.nav-link__new-album').click(createAlbumModal);

/*при нажатии на конкретный альбом*/
$('body').on('click', '.albums__name', function(e){
  e.preventDefault();
  $(this).closest('.albums__list__item').addClass('active-album');

  var albumID = $(this).closest('.albums__list__item').attr('data-album-id');
console.log(albumID);
  // App.AlbumControllerID(token, albumID);
  App.PhotoController(token, albumID);

  return false;
});



/*клик на кнопку создания альбома*/ /*работает*/
$('body').on('click', '.modal-edit', function(){
  var tabalbums = $('.nav-link__albums').data('tab');
  $('[data-content =  ' + tabalbums + ']').fadeIn();

  $('a').removeClass('active');
  $('label').removeClass('active');
  $('.nav-link__albums').addClass('active');
  console.log('создан новый альбом');
  App.AlbumControllerPost(token);
  App.AlbumController(token);
  $('.modal').remove();
  $('.modal-overlay').remove();
});

/*закрываем окно с созданием альбома*/ /*работает*/
$('body').on('click', '.modal-close', function(){
  $('.modal').remove();
});

/*удаление альбома при нажатии на крестик*/ /*работает*/
$('body').on('click', '.albums__list__item--delete', function(e){
  e.preventDefault();
  console.log('Пытаемся удалить альбом');
  var albumID = $(this).closest('.albums__list__item').attr('data-album-id');
  App.AlbumControllerDelete(token, albumID);
  return false;
});



/*удаление альбома при нажатии на RemoveAlbum*/ /*работает*/
$('body').on('click', '.nav-link__remove-album', function(e){
  e.preventDefault();
  var tab = $(this).siblings('.nav-link__albums').data('tab');
  var albumID = $('[data-content =  ' + tab + ']').find('.active-album').attr('data-album-id');
  console.log(albumID);
  App.AlbumControllerDelete(token, albumID);
  return false;
});










/*фотографии ID*/ /*не работает*/

$('body').on('click', '.photo__item', function(e){
  e.preventDefault();
  var photoID = $(this).attr('data-photo-id');
  console.log(photoID);
  App.PhotoControllerID(token, photoID);
      return false;
    });





/*загрузка новых фотографий*/ /*не работает*/
$('body').on('click', '.nav-link__new-photo', function(e){
  e.preventDefault();
  var photoID = $(this).closest('.photos__list__item').attr('data-album-id');

  App.AlbumControllerID(token, albumID);
  App.PhotoController(token, albumID);
  App.PhotoControllerPost(token, albumID);
      // $(this).closest('.albums__list__item').addClass('activeAlbum');
      return false;
    });





