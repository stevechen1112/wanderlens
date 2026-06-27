let windowWidth = 0;
let windowHeight = 0;
let windowScrollTop = 0;

$(function () {
  getCookieByName('privacy');
  mobileMenu(1000);
  sliderMenu('.language');
  sliderMenu('.menuMember');
});

// table過長時增加卷軸
$('table').wrap('<div class="tableBox"></div>');

// 單層選單功能
function sliderMenu(elm) {
  $(elm)
    .children('.btn')
    .off()
    .on('click', function () {
      $(this).parent().toggleClass('active');
      $(this).siblings('ul').slideToggle('fast');
      $(elm).siblings('.active').find('ul').slideToggle('fast');
      $(elm).siblings('.active').removeClass('active');
      $('body').removeClass('mobileOpen');
    });
  $(window).on('load resize', function () {
    $(elm).find('ul').removeAttr('style');
    $(elm).removeClass('active');
  });
}

// 滾動畫面時
$(window).on('load scroll', function () {
  let headHeigh = $('.headerBox').outerHeight();
  if ($(window).scrollTop() > 0) {
    $('body').addClass('headFix');
    $('.mainMenu .toggleBtn').siblings('ul').css('top', headHeigh);
  } else {
    $('body').removeClass('headFix');
    headHeigh = $('.headerBox').outerHeight();
    $('.mainMenu .toggleBtn').siblings('ul').css('top', headHeigh);
  }
});

// QA風琴功能
function qa(q, a) {
  $(q).on('click', function () {
    var thisq = $(this);
    var thisp = thisq.parent();
    if (thisp.is('.active') == true) {
      thisp.toggleClass('active').find(a).slideToggle('fast');
    } else {
      thisp.siblings('.active').removeClass('active').find(a).slideToggle('fast');
      thisp.toggleClass('active').find(a).slideToggle('fast');
    }
  });
}

// 主選單
(function () {
  $('.siteHeader').append('<div class="mobileBtn"></div>');
  $('.mainMenu li').has('ul').addClass('nextLv').append('<span class="toggleBtn"></span>');
  $('.mainMenu .nextLv > a')
    .off('click')
    .on('click', function () {
      $(this).siblings('.toggleBtn').trigger('click');
      return false;
    });

  $('.mainMenu .toggleBtn')
    .off('click')
    .on('click', function () {
      let headHeigh = $('.headerBox').outerHeight();
      $(this).siblings('ul').stop().slideToggle();
      $(this).siblings('ul').css('top', headHeigh);
      $('.mainMenu li ul').not($(this).parent('li').children('ul')).stop(true, false).slideUp();
      $(this).parent().toggleClass('active');
      $('.mainMenu li').not($(this).parent('li')).removeClass('active');
    });
})();

// // lazyload
// (function () {
//   const placeholderSrc = (w, h) => `data:image/svg+xml,%3Csvg xmlns="http:// www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`;
//   const options = {
//     root: null,
//     rootMargin: '0px',
//     thresholds: 1,
//   };

//   let observer = new IntersectionObserver((entries) => {
//     entries.forEach((item) => {
//       if (item.isIntersecting) {
//         item.target.src = item.target.dataset.src;
//         item.target.classList.add('picAnimated');
//         observer.unobserve(item.target);
//       }
//     });
//   }, options);

//   document.querySelectorAll('.lazyLoad').forEach((item) => {
//     item.src = placeholderSrc(item.dataset.width, item.dataset.height);
//     observer.observe(item);
//   });
// })();

// (function () {
//   const options = {
//     root: null,
//     rootMargin: '0px',
//     thresholds: 1,
//   };

//   let observer = new IntersectionObserver((entries) => {
//     entries.forEach((item) => {
//       if (item.isIntersecting) {
//         item.target.src = item.target.dataset.src;
//         item.target.classList.add('picAnimated');
//         observer.unobserve(item.target);
//       }
//     });
//   }, options);

//   document.querySelectorAll('.lazyLoad').forEach((item) => {
//     observer.observe(item);
//   });
// })();

// 偵測物件距離顯示畫面，需要偵測的物件增加.isAnimate
(function () {
  let options = {
    root: null,
    rootMargin: '0px',
    thresholds: 0.5,
  };
  let observer = new IntersectionObserver((entries) => {
    entries.forEach((elm) => {
      if (elm.isIntersecting) {
        elm.target.classList.add('isAnimated');
      } else {
        elm.target.classList.remove('isAnimated');
      }
    });
  }, options);

  document.querySelectorAll('.isAnimate').forEach((elm) => {
    observer.observe(elm);
  });
})();

//  GOTOP
// (function () {
//   let goTopBtn = document.querySelector('.goTop');

//   window.addEventListener('scroll', function () {
//     let windowScrollTop = document.documentElement.scrollTop;
//     if (windowScrollTop >= 200) {
//       goTopBtn.style.cssText = 'opacity:1';
//     } else {
//       goTopBtn.style.cssText = 'opacity:0';
//     }
//   });
//   goTopBtn.addEventListener('click', function () {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   });
// })();

// cookie
function getCookieByName(name) {

  //var value = Cookies.get(name);
  var value = localStorage.getItem(name)

  if (value !== 'true') {
    $('.closePrivacy').on('click', function () {
      // Cookies.set(name, 'true');
      localStorage.setItem(name, 'true')

      $('.privacyBox').slideUp(400, function () {
        $(this).remove();
      });
    });
  } else {
    $('.privacyBox').remove();
  }
}

// 手機主選單
function mobileMenu(maxWidth) {
  $(window).on('load resize', function () {
    windowWidth = $(window).outerWidth();
    if (windowWidth < maxWidth) {
      $('body').addClass('onMobile');
      $('body').removeClass('mobileOpen');
    } else {
      $('body').removeClass('onMobile');
    }
  });

  $(window).on('load resize', function () {
    $('.menuBox').removeClass('active');
  });

  $('.mobileBtn').on('click', function (event) {
    $('.menuBox').addClass('active');
    $('body').toggleClass('mobileOpen');
    $('.menuMember.active,.language.active').removeClass('active').find('ul').slideUp();
  });
}

// 無限輪播
function sliderUse(elm) {
  console.log('sliderUse')
  let parentBox = $(elm);
  let parentBoxWidth = parentBox.outerWidth();
  let sliderMovePx = 0;
  let request;
  let parentBoxDef = parentBox.parent().html();
  parentBox.parent().append(parentBoxDef);

  let elemParent = parentBox.parent();

  $(window).on('load resize', function () {
    cancelAnimationFrame(request);
    requestAnimationFrame(animation);
  });

  elemParent.on('mouseover', function () {
    cancelAnimationFrame(request);
  });
  elemParent.on('mouseleave', function () {
    requestAnimationFrame(animation);
  });

  function animation() {
    sliderMovePx++;
    if (sliderMovePx < parentBoxWidth) {
      $(elm).css('transform', `translateX(-${sliderMovePx}px)`);
      request = requestAnimationFrame(animation);
    } else {
      sliderMovePx = 0;
      request = requestAnimationFrame(animation);
    }
  }
}

// 滾動漂浮
// $(window).on('load resize', function () {
//   $(window).on('scroll', function () {
//     if (windowWidth > 800) {
//       let bg_use = $('.bgUse');
//       let bg_use_h = ((windowScrollTop - 100) / $('.mainBox').height()) * 100;
//       if (windowScrollTop > 0) {
//         TweenLite.to(bg_use, 1, {
//           'background-position': '0 ' + bg_use_h + '%',
//         });
//       } else {
//         TweenLite.to(bg_use, 1, {
//           'background-position': '0 ' + '0' + '%',
//         });
//       }

//       $('.acBoxDown').each(function () {
//         let box_t = $(this).offset().top;
//         let ac_move = $(this).find('.acMove');
//         if (windowScrollTop + windowHeight / 3 > box_t && windowWidth > 800) {
//           TweenLite.to(ac_move, 1, {
//             y: (windowScrollTop + windowHeight / 3 - box_t) / 10,
//           });
//         }
//       });

//       $('.acBoxUp').each(function () {
//         let box_t = $(this).offset().top;
//         let ac_move = $(this).find('.acMove');
//         if (windowScrollTop + windowHeight / 3 > box_t && windowWidth > 800) {
//           TweenLite.to(ac_move, 1, {
//             y: -(windowScrollTop + windowHeight / 3 - box_t) / 10,
//           });
//         }
//       });
//     }
//   });
// });

// 跟隨滑鼠
$.fn.parallax = function (resistance, mouse) {
  $el = $(this);
  TweenLite.to($el, 0.2, {
    x: -((mouse.clientX - window.innerWidth / 2) / resistance),
    y: -((mouse.clientY - window.innerHeight / 2) / resistance),
  });
};

// 倒數用
$.fn.animateNumbers = function (stop, commas, duration, ease) {
  return this.each(function () {
    let $this = $(this);
    let start = parseInt($this.text().replace(/,/g, ''));
    commas = commas === undefined ? true : commas;
    $({
      value: start,
    }).animate(
      {
        value: stop,
      },
      {
        duration: duration == undefined ? 1000 : duration,
        easing: ease == undefined ? 'swing' : ease,
        step: function () {
          $this.text(Math.floor(this.value));
          if (commas) {
            $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
          }
        },
        complete: function () {
          if (parseInt($this.text()) !== stop) {
            $this.text(stop);
            if (commas) {
              $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
            }
          }
        },
      }
    );
  });
};

// 開啟畫面動態效果
// AOS.init({
//   offset: 100, // 移動距離 (單位為像素)
//   delay: 0, // 延遲時間，範圍從 0-3000
//   duration: 1000, // 完成動畫所需的時間，範圍從 0-3000
//   easing: 'ease', // 動畫曲線
//   once: true, // 動畫是否只跑一次
//   mirror: false, // 鏡像
//   anchorPlacement: 'top-bottom', // 動畫觸發的位置
// });

// 開啟畫面動態效果
// new WOW({
//   boxClass: 'wow', // default
//   animateClass: 'animated', // default
//   offset: 50, // default
//   mobile: true, // default
//   live: true, // default
// }).init();

function clickOtherDoSth(elem, callback) {
  $(document).on('click', function (e) {
    console.dir(e.target);
    if ($(e.target).parents(elem).length == 0) {
      callback && typeof callback === 'function' && callback();
    }
  });
}

function jsSlideToggle(elem) {
  let content = document.querySelector(elem);
  let display = window.getComputedStyle(content).display;
  content.style.display = display;

  if (display === 'none') {
    display = 'block';
    content.style.overflow = 'hidden';
    content.style.display = display;
    let height = content.offsetHeight;
    content.style.height = 0;
    content.offsetHeight;
    content.style.transitionProperty = 'height';
    content.style.transitionDuration = `300ms`;
    content.style.height = height + 'px';

    setTimeout(() => {
      content.style.removeProperty('overflow');
      content.style.removeProperty('height');
      content.style.removeProperty('transition-duration');
      content.style.removeProperty('transition-property');
    }, 300);
  } else {
    content.style.overflow = 'hidden';
    content.style.height = `${content.offsetHeight}px`;
    content.style.transitionProperty = 'height';
    content.style.transitionDuration = `300ms`;
    content.offsetHeight;
    content.style.height = 0;
    setTimeout(() => {
      content.style.display = 'none';
      content.style.removeProperty('overflow');
      content.style.removeProperty('height');
      content.style.removeProperty('transition-duration');
      content.style.removeProperty('transition-property');
    }, 300);
  }
}
