<template>
	<section class="bottomInfoBox">
		<div class="container">
		  <div class="box faqBox">
		    <div class="conBox">
		      <h2 class="title">FAQ</h2>
		      <div class="listBox">
		        <div class="item" v-for="faq in faqList" :key="faq.id">
              <router-link to="/faq">{{faq.question}}</router-link>
            </div>
		      </div>
		    </div>
		  </div>
		  <div class="box recruitBox">
		    <div class="conBox">
		      <h2 class="title">{{ $t('Components.Recruit.recruit') }}</h2>
          <div>
            <iframe allowtransparency='true' scrolling='no' src='//www.facebook.com/v2.5/plugins/page.php?href=https://www.facebook.com/joyshotapp&amp;width=250&amp;show_facepile=true&amp;small_header=false&amp;hide_cover=false&amp;show_posts=true&amp;locale=zh_TW' style='border:none; overflow:hidden;max-width: 100%; width: 250px; height: 130px;'></iframe>
          </div>

		    </div>
		  </div>
		</div>


	</section>
</template>

<script>

export default {
	name: 'Recruit',
  components:{

  },
  data(){
    return {
      pageNum: 1,
      pageSize: 5,
      faqList:[]
    }
  },
  methods:{
    loadFaq(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        lang: this.getLang(),
      }

      this.request.get('/faq', { params: query }).then(res => {
          if (res.code === '200') {
            this.faqList = res.data.records
            this.total = res.data.total
          } else {
            this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
    }
  },
  mounted(){
    this.loadFaq()
  }
}

</script>

<style scoped>

.bottomInfoBox .container {
  max-width: 1542px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.bottomInfoBox .box {
  width: calc(50% - 18px);
  display: flex;
  flex-grow: 1;
  margin: 0 9px;
  padding: 0 0 30px 30px;
  background: #f6f6f6;
}
@media screen and (max-width: 1000px) {
  .bottomInfoBox .box {
    margin: 0;
    padding: 20px;
    width: 100%;
  }
  .bottomInfoBox .box + .box {
    margin-top: 20px;
  }
}
.bottomInfoBox .box::before {
  content: "";
  width: 50%;
  max-width: 320px;
  aspect-ratio: 16/17;
  display: block;
  flex-grow: 1;
  margin-top: -37px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
@media screen and (max-width: 1250px) {
  .bottomInfoBox .box::before {
    width: 30%;
  }
}
@media screen and (max-width: 1000px) {
  .bottomInfoBox .box::before {
    width: 30%;
    margin-top: 0;
  }
}
.bottomInfoBox .box .conBox {
  padding: 60px 30px 0;
  flex-grow: 1;
  position: relative;
}
@media screen and (max-width: 1000px) {
  .bottomInfoBox .box .conBox {
    width: 70%;
    padding: 30px 0px 0 20px;
  }
}
.bottomInfoBox .box.faqBox::before {
  background-image: url("~@/assets/images/index/faq_pic.jpg");
}
.bottomInfoBox .box.recruitBox::before {
  background-image: url("~@/assets/images/index/recruit_pic.jpg");
}
.bottomInfoBox .box.recruitBox .conBox {
  padding: 60px 30px 70px;
}
@media screen and (max-width: 1000px) {
  .bottomInfoBox .box.recruitBox .conBox {
    padding: 30px 0px 70px 20px;
  }
}
.bottomInfoBox .box.recruitBox a {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 30px;
  width: 100%;
  max-width: 230px;
  border-radius: 50px;
  background: #52b6cc;
  padding: 17px 15px;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  transition: all 0.3s ease;
}
.bottomInfoBox .box.recruitBox a::after {
  content: "";
  width: 18px;
  height: 9px;
  display: block;
  -webkit-mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
          mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
  background: #fff;
  margin-left: 5px;
}
.bottomInfoBox .box.recruitBox a:hover {
  transform: translateX(-3px) translateY(-3px);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.2);
}
.bottomInfoBox .box .title {
  font-size: 2.25rem;
  font-weight: 400;
  padding: 0;
  margin: 0 0 10px 0;
  line-height: 1.2;
}
@media screen and (max-width: 1200px) {
  .bottomInfoBox .box .title {
    font-size: 1.75rem;
  }
}
.bottomInfoBox .box .listBox {
  width: 100%;
}
.bottomInfoBox .box .listBox .item {
  position: relative;
  padding: 5px 0 5px 25px;
}
.bottomInfoBox .box .listBox .item + .item {
  border-top: #dddddd 1px solid;
}
.bottomInfoBox .box .listBox .item::before {
  content: "";
  position: absolute;
  width: 8px;
  aspect-ratio: 1/1;
  background: #52b6cc;
  display: block;
  left: 2px;
  top: 14px;
  border-radius: 100%;
}/*# sourceMappingURL=index.css.map */
</style>
