import Flatpickr from "flatpickr";
import {Korean} from "flatpickr/dist/l10n/ko"
require('flatpickr/dist/flatpickr.min.css');
require('assets/scss/plugins/flatpickr.scss');
import Vue from "vue";

Vue.directive("flatpickr", {
	bind: (el, binding) => {
		Flatpickr.localize(Korean)
		var icon = el.querySelector('a');
		if(icon) {
			el._flatpickr = new Flatpickr(el, binding.value);
		} else {
			const input = el.querySelector('input');
			input._flatpickr = new Flatpickr(input, binding.value);
		}
	},
	unbind: (el) => {
		var icon = el.querySelector('a');
		if(icon) {
			el._flatpickr.destroy()
		} else {
			el.querySelector('input')._flatpickr.destroy()
		}
	}
});
