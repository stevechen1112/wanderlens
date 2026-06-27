// 共用參數
const _body = document.querySelector('body');
let _windowWidth = window.outerWidth;
window.addEventListener('resize', function () {
  _windowWidth = window.outerWidth;
});

// 電腦版主選單搜尋功能
// (function () {
//   // 搜尋功能
//   let body = document.querySelector('body');
//   let overLayer = document.createElement('div');
//   overLayer.className = 'overLayer';
//   let searchInput = document.querySelector('.menuSearch .searchBox input');
//   searchInput.addEventListener('click', function () {
//     body.append(overLayer);
//     body.classList.toggle('searchOpen');
//     jsSlideToggle('.menuSearch .bottom');
//   });
//   overLayer.addEventListener('click', function () {
//     body.classList.remove('searchOpen');
//     jsSlideToggle('.menuSearch .bottom');
//     overLayer.remove();
//   });

//   let item = document.querySelectorAll('.block1 label');

//   item.forEach((v) => {
//     v.addEventListener('click', function (e) {
//       if (e.target.nodeName === 'INPUT' && e.target.checked === true) {
//         e.target.parentNode.classList.add('active');
//       } else {
//         e.target.parentNode.classList.remove('active');
//       }
//     });
//   });
// })();

function lightBox(elm, title, txt, more) {
  let lightBoxContent = document.createElement('div');
  lightBoxContent.innerHTML = `
      <div class="overLayer"></div>
      <div class="lightBox">
      <div class="closeLightBoxBtn"></div>
      <div class="titleBox">${title}</div>
      <div class="content">${txt}</div>
      <a class="back" href="index.html">${more}</a>
    </div>`;
  lightBoxContent.className = 'outLightBox';

  let openLightItem = document.querySelector(elm) || null;
  let body = document.querySelector('body');
  let overLayer;
  let closeLightBoxBtn;

  // 開啟燈箱
  if (openLightItem !== null) {
    openLightItem.addEventListener('click', function () {
      console.log('a');
      body.append(lightBoxContent);
      body.classList.add('lightBoxOpen');
      overLayer = document.querySelector('.overLayer');
      closeLightBoxBtn = document.querySelector('.closeLightBoxBtn');
      overLayer.addEventListener('click', closeLightBox, false);
      closeLightBoxBtn.addEventListener('click', closeLightBox, false);
    });
  }
  // 關閉燈箱
  //

  function closeLightBox() {
    body.classList.add('lightBoxClose');
    let closeLightBox = document.querySelector('.lightBoxClose .outLightBox');

    closeLightBox.addEventListener('animationend', closeLightBoxBody);
    function closeLightBoxBody() {
      body.classList.remove('lightBoxClose');
      body.classList.remove('lightBoxOpen');
      lightBoxContent.remove();
      // 避免開啟燈箱的css動畫影響，每次關閉時清除偵聽
      closeLightBox.removeEventListener('animationend', closeLightBoxBody);
    }
  }
}

function innerPageLightBox(elm, detail) {
  let _picItem = document.querySelectorAll(elm);
  let _lightBoxPic = document.querySelector('.outLightBox .picBox .swiper-wrapper');
  let _lightBoxTxt = document.querySelector('.outLightBox .conBox .swiper-wrapper');
  let _productsDetail = document.querySelector(detail);
  let _productsDetailPicBox = document.querySelector('.picListBox');
  let _lightBoxState = [];

  _picItem.forEach(function (s, i) {
    // 將資料丟進陣列
    _lightBoxState.push({ index: i + 1, picUrl: s.querySelector('.pic').dataset.url, title: s.querySelector('.pic').dataset.title, txt: s.querySelector('.pic').dataset.txt });

    // 從陣列裡面抓資料出來顯示在頁面中
    let swiperPicState = `<div class="swiper-slide">\
                <div class="swiper-zoom-container">
                  <div class="pic swiper-zoom-target" style="background-image:url('${_lightBoxState[i].picUrl}')"></div>\
                </div>\
              </div>`;
    let swiperTxtState = `<div class="swiper-slide">\
                  <div class="number">${_lightBoxState[i].index}</div>\
                  <div class="txtBox">
                    <div class="title">${_lightBoxState[i].title}</div>\
                    <div class="txt">${_lightBoxState[i].txt}</div>\
                  </div>\
              </div>`;
    _lightBoxPic.innerHTML += swiperPicState;
    _lightBoxTxt.innerHTML += swiperTxtState;

    // 資料複製到外層
    $(window).on('load resize', function () {
      let _productsListTop = s.offsetTop;
      s.addEventListener('mouseover', function () {
        let productsInfo = `<div class="number">${_lightBoxState[i].index}</div>\
                <div class="txt">${_lightBoxState[i].title}</div>`;
        _productsDetail.style = `opacity:1;transform: translateY(${_productsListTop}px)`;
        _productsDetail.innerHTML = productsInfo;
      });
    });

    // 開啟燈箱
    s.addEventListener('click', function () {
      swiperTxt.slideTo(i);
      swiperPic.slideTo(i);
    });
  });

  _productsDetailPicBox.addEventListener('mouseleave', function () {
    _productsDetail.style.opacity = '0';
  });

  const swiperTxt = new Swiper('.swiperTxt', {
    effect: 'fade',
  });

  const swiperPic = new Swiper('.swiperPic', {
    zoom: {
      maxRatio: 1.5,
    },
    mousewheel: true,
    navigation: {
      nextEl: '.swiper-arrow.swiper-next',
      prevEl: '.swiper-arrow.swiper-prev',
      disabledClass: 'swiper-disabled',
    },
    thumbs: {
      swiper: swiperTxt,
    },
  });
  let swiperSlide = document.querySelectorAll('.swiperPic .swiper-slide');
  swiperSlide.forEach(function (w) {
    w.addEventListener('click', function (e) {
      swiperPic.zoom.toggle();
    });
  });
}

let dpMin, dpMax;
dpMin = new AirDatepicker('#dpMin', {
  locale: zh,
  inline: true,
  onSelect({ date }) {
    dpMax.update({
      minDate: date,
    });
  },
});

dpMax = new AirDatepicker('#dpMax', {
  locale: zh,
  inline: true,
  onSelect({ date }) {
    dpMin.update({
      maxDate: date,
    });
  },
});

function formatState(state) {
  if (!state.id) {
    return state.text;
  }
  var baseUrl = '/user/pages/images/flags';
  var $state = $(`<span>${state.text}</span>`);
  return $state;
}

$('.searchMap').select2({
  templateResult: formatState,
});
