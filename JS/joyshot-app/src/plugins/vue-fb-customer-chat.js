import Vue from "vue";
import VueFbCustomerChat from "vue-fb-customer-chat";

export default function (context) {
    const locale = context.app.i18n.locale;

    Vue.use(VueFbCustomerChat, {
        locale: locale === "zh" ? "zh_TW" : "en_US",
        page_id: "840434122664996",
        theme_color: "#333333",
    });
};
