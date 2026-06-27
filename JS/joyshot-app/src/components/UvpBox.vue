<template>
	<section class="indexTopBox">
    <div class="container">
      <div class="aboutBox">
        <div class="title">{{ $t('Components.UvpBox.title') }}</div>
        <div class="txt">{{ $t('Components.UvpBox.description') }}</div>
      </div>
      <div class="sloganBox">
        <ul>
          <li :prefix="$t('Components.UvpBox.tag1')"><div class="txt">{{ $t('Components.UvpBox.slogan1') }}</div></li>
          <li :prefix="$t('Components.UvpBox.tag2')"><div class="txt">{{ $t('Components.UvpBox.slogan2') }}</div></li>
          <li :prefix="$t('Components.UvpBox.tag3')"><div class="txt">{{ $t('Components.UvpBox.slogan3') }}</div></li>
          <li :prefix="$t('Components.UvpBox.tag4')"><div class="txt">{{ $t('Components.UvpBox.slogan4') }}</div></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>

export default {
	name: 'UvpBox'
}

</script>

<style scoped>

.indexTopBox {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 40%, rgba(237, 237, 237, 1) 100%);
  padding: 0;
}
.indexTopBox .container {
  max-width: 1560px;
  display: flex;
}
@media screen and (max-width: 1400px) {
  .indexTopBox .container {
    flex-direction: column;
  }
}

.indexTopBox .container .aboutBox,
.indexTopBox .container .sloganBox {
  padding: 0 5% 6%;
}
.indexTopBox .container .aboutBox {
  width: 60%;
}
.indexTopBox .container .aboutBox .title {
  font-size: 36px;
  margin: 0 0 4% 0;
  line-height: 1;
}

@media screen and (max-width: 1400px) {
  .indexTopBox .container .aboutBox .title {
    font-size: 24px;
  }
}

.indexTopBox .container .aboutBox .txt {
  font-size: 20px;
  line-height: 2;
}

@media screen and (max-width: 1400px) {
  .indexTopBox .container .aboutBox .txt {
    font-size: 18px;
    line-height: 1.6;
  }
}

.indexTopBox .container .sloganBox {
  width: 40%;
  padding: 2% 5% 5%;
  font-size: 21px;
  border-left: #dddddd 1px solid;
}
@media screen and (max-width: 1400px) {
  .indexTopBox .container .sloganBox {
    font-size: 17px;
  }
}
@media screen and (max-width: 1000px) {
  .indexTopBox .container .sloganBox {
    width: 100%;
    padding: 20px;
    border-left: none;
    border-top: 1px solid #dddddd;
  }
}
.indexTopBox .container .sloganBox li {
  display: flex;
  align-items: flex-start;
}
.indexTopBox .container .sloganBox li::before {
  content: '';
  background: #f37a69;
  font-weight: 700;
  padding: 5px 5px;
  display: block;
  border-radius: 5px;
  color: #fff;
  line-height: 1;
  letter-spacing: 4px;
  text-indent: 4px;
  margin: 0 15px 0 0;
}
.en-app .indexTopBox .container .sloganBox li::before,
.jp-app .indexTopBox .container .sloganBox li::before,
.kr-app .indexTopBox .container .sloganBox li::before {
  text-align: center;
  font-size: 20px;
  width: 180px;
  letter-spacing: 0px;
  flex-shrink: 0;
}
.indexTopBox .container .sloganBox li::before {
  content: attr(prefix);
}
.indexTopBox .container .sloganBox li + li {
  margin-top: 20px;
}
.indexTopBox .container .sloganBox .txt {
  border-bottom: #dddddd 1px solid;
  flex-grow: 1;
}
.indexTopBox .container .sloganBox li + li {
  margin-top: 20px;
}
.indexTopBox .container .sloganBox .txt {
  border-bottom: #dddddd 1px solid;
  flex-grow: 1;
}
@media screen and (max-width: 1380px) {
  .indexTopBox .container .aboutBox,
  .indexTopBox .container .sloganBox {
    width: 50%;
  }
}
@media screen and (max-width: 1000px) {
    .indexTopBox .container .aboutBox,
    .indexTopBox .container .sloganBox {
      width: 100%;
      padding: 0px 0 20px;
    }
    .indexTopBox .container .sloganBox {
      padding: 30px 0;
    }
}
</style>


