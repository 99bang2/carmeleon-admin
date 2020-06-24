import Vue from "vue";
import VueLazyload from "vue-lazyload";

import error from "~/assets/img/logo1.png";
import loading from "~/assets/img/logo2.png";

Vue.use(VueLazyload, {
	preLoad: 1,
	error: error,
	loading: loading,
	attempt: 1
});
