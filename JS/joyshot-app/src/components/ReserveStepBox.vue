<template>
  <section class="reserveBox">
    <div class="container">
      <div class="titleBox">
        <h2>{{ $t('home.reserve_step.title') }}</h2>
      </div>
      <div class="listBox">
        <div class="item">
          <div class="title">{{ $t('home.reserve_step_1.title') }}</div>
          <div class="txt">{{ $t('home.reserve_step_1.sub_title') }}</div>
        </div>
        <div class="item">
          <div class="title">{{ $t('home.reserve_step_2.title') }}</div>
          <div class="txt">{{ $t('home.reserve_step_2.sub_title') }}</div>
        </div>
        <div class="item">
          <div class="title">{{ $t('home.reserve_step_3.title') }}</div>
          <div class="txt">{{ $t('home.reserve_step_3.sub_title') }}</div>
        </div>
        <div class="item">
          <div class="title">{{ $t('home.reserve_step_4.title') }}</div>
          <div class="txt">{{ $t('home.reserve_step_4.sub_title') }}</div>
        </div>
        <div class="item">
          <div class="title">{{ $t('home.reserve_step_5.title') }}</div>
          <div class="txt">{{ $t('home.reserve_step_5.sub_title') }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
	name: 'ReserveStepBox'
}

</script>

<style scoped>

.reserveBox {
  background: #fff5f4;
  padding-bottom:10%;
}

@media screen and (max-width: 1000px) {
  .reserveBox .titleBox {
    padding: 45px 0 20px;
  }
}
.reserveBox .container {
  max-width: 1560px;
}

.reserveBox .listBox {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -16px;
  padding: 6% 0 0;
}

.reserveBox .item {
  margin: 0 16px 32px;
  border-radius: 15px;
  background: #fff;
  counter-increment: countItem;
  position: relative;
  padding: 50px 30px 30px;
  border: 2px solid #f37a69;
}

@media screen and (min-width: 1301px) {
  .reserveBox .item {
    width: calc(20% - 60px);
    padding: 40px 20px 20px;
    margin: 0 30px 0;
  }

  .reserveBox .item:first-child {
    margin: 0 30px 0 0;
  }

  .reserveBox .item:last-child {
    margin: 0 0 0 30px;
  }
}

@media screen and (max-width: 767px) {
  .reserveBox .item {
    padding: 35px 20px 15px !important;
  }
}

@media screen and (max-width: 1300px) {
  .reserveBox .item {
    width: calc(100% / 2 - 40px);
    margin: 0 20px 100px;
  }

  .reserveBox .item:last-child {
    margin: 0 20px;
    width: 100%;
  }
}

@media screen and (max-width: 767px) {
  .reserveBox .item {
    padding: 20px 25px;
  }
}
.reserveBox .item + .item::before {
  content: '';
  position: absolute;
  background: url('~@/assets/images/index_arrow.png') no-repeat;
  width: 23px;
  height: 21px;
  display: block;
  left: 0;
  top: 50%;
  transform: translateY(-50%) translateX(calc(-100% - 20px));
}
@media screen and (min-width: 501px) and (max-width: 1300px) {
  .reserveBox .item + .item::before {
    transform: translateY(-50%) translateX(calc(-100% - 10px));
  }
  .reserveBox .item:nth-child(1) {
    order: 0;
  }
  .reserveBox .item:nth-child(2) {
    order: 1;
  }
  .reserveBox .item:nth-child(3) {
    order: 3;
  }
  .reserveBox .item:nth-child(4) {
    order: 2;
  }
  .reserveBox .item:nth-child(5) {
    order: 4;
  }
  .reserveBox .item:nth-child(3)::before {
    top: 0;
    left: 50%;
    transform: translateY(-400%) translateX(calc(-50%)) rotate(90deg);
  }

  .reserveBox .item:nth-child(4)::before {
    left: auto;
    right: 0;
    transform: translateY(-50%) translateX(calc(100% + 10px)) scaleX(-1);
  }
  .reserveBox .item:last-child::before {
    left: 25%;
    top: 0;
    transform: translateY(-400%) translateX(calc(-50%)) rotate(90deg);
  }
}
@media screen and (max-width: 500px) {
  .reserveBox .item {
    width: 100%;
    margin: 0 20px 40px;
  }
  .reserveBox .item + .item::before {
    left: 50%;
    top: 0;
    transform: translateY(-400%) translateX(calc(-50%)) rotate(90deg);
    display:none;
  }
}

.reserveBox .item .title::after {
  content: '0' counter(countItem);
  position: absolute;
  font-size: 86px;
  color: #f8b9b1;
  font-weight: 500;
  line-height: 0.6;
  font-style: italic;
  top: 0;
  left: 50%;
  transform: translateY(-100%) translateX(calc(-50% + 45px));
  font-family: 'Hind', Arial, '微軟正黑體', 'Microsoft JhengHei', '蘋果儷中黑', 'Apple LiGothic Medium', sans-serif, '0xe804';
}
@media screen and (max-width: 1400px) {
  .reserveBox .item .title::after {
    font-size: 60px;
    transform: translateY(-100%) translateX(calc(-50% + 45px));
  }
}
@media screen and (max-width: 500px) {
  .reserveBox .item .title::after {
    font-size: 24px;
    position: relative;
    left:auto;
    transform: translateY(2px) translateX(0%);
    order:-1;
    margin:0 10px;
    font-style:unset;
    line-height:1;
    color:#FFF;
  }
}

.reserveBox .item .title::before {
  content: 'STEP';
  position: absolute;
  font-weight: 700;
  -webkit-text-stroke: 1px #f8b9b0;
  color: #fff5f4;
  font-size: 36px;
  left: 50%;
  top: 0;
  transform: translateY(-80%) translateX(calc(-50% - 40px));
}
@media screen and (max-width: 1400px) {
  .reserveBox .item .title::before {
    font-size: 28px;
  }
}
@media screen and (max-width: 500px) {
  .reserveBox .item .title::before {
    font-size: 20px;
    position: relative;
    left:auto;
    transform: translateY(0%) translateX(0%);
    order:-1;
    line-height:1;
    color:#FFF;
  }
}

.reserveBox .item .title {
  font-size: 24px;
  color: #fff;
  background: #f37a69;
  border: 2px solid #fff;
  position: relative;
  z-index: 1;
  position: absolute;
  top: 0;
  width: 90%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  text-align: center;
  border-radius: 50px;
  padding: 10px;
}
.en-app .reserveBox .item .title,
.jp-app .reserveBox .item .title {
  font-size: 18px;
  width: 180px;
  line-height: 1.2;
}
@media screen and (max-width: 1400px) {
  .reserveBox .item .title {
    font-size: 20px;
    padding: 5px 10px;
  }
}
@media screen and (max-width: 500px) {
  .reserveBox .item .title {
    display:flex;
    justify-content: center;
    align-items: center;
  }
}

.reserveBox .item .txt {
  color: #000;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

@media screen and (max-width: 767px) {
  .reserveBox .item .txt {
    font-size: 16px;
  }
}

</style>
