<template>
<!--
  <div class="menuMember">
    <div class="btn"></div>
    <ul>
      <li><a href="member_profile.html">會員資料</a></li>
      <li><a href="member_password.html">修改密碼</a></li>
      <li><a href="member_forgot.html">忘記密碼</a></li>
    </ul>
  </div>
-->
  <div class="language">
    <div class="btn" title="Language">
      <template v-for="(locale) in locales">
        <span :key="locale.code" v-if="$i18n.locale === locale.code">{{ locale.name }}</span>
      </template>
    </div>
    <ul>
      <li @click="switchLang(locale.code)" :key="locale.code" v-for="(locale) in locales">
        <a href="#" v-if="$i18n.locale !== locale.code">{{ locale.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  import {getSupportedLocales} from "@/util/i18n/supported-locales";

  export default {
    name: 'HeaderNav',
    data() {
      return {locales: getSupportedLocales()};
    },
    methods:{
      switchLang(locale) {
        localStorage.setItem("VUE_APP_I18N_LOCALE", locale);
        location.reload();
      }
    }
  }
</script>
