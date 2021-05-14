import Vue from 'vue'
import { scDom } from '~/assets/js/utils'
import {mapState} from "vuex"
const { css } = scDom;
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../configs/config.json')[env]

Vue.mixin({
	data: () => ({
		config: config,
	}),
	computed: {
		...mapState([
			'site'
		])
	},
	methods: {
		isFileImage(file) {
			return file && file['type'].split('/')[0] === 'image';
		},
		uuidV4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				let r = Math.random() * 16 | 0,
					v = c === 'x' ? r : (r & 0x3 | 0x8)
				return v.toString(16)
			})
		},
		callNotification(msg) {
			UIkit.notification(`<div class="uk-flex uk-flex-middle"><i class="mdi mdi-check-all uk-margin-right md-color-light-green-400"></i>${msg}</div>`)
		},
		callAlertError(msg, opt) {
			UIkit.modal.alert(`<span class="md-color-red-400 mdi mdi-alert-outline uk-margin-small-right"></span> ${msg}`, opt)
		},
		async fetchAndOpenForm(uid, isSeverSide) {
			await this.fetchData()
			if(isSeverSide) {
				this.resUid = uid
			}else {
				this.gridOptions.api.forEachNode((node) => {
					if(node.data.uid === uid) {
						this.openForm({
							node: node,
							data: node.data
						})
					}
				})
			}
		},
		pageScrollbarDisable () {
			css(document.documentElement, {
				'overflow': 'hidden'
			});
			css(document.body, {
				'overflow-y': 'scroll'
			});
			css(document.getElementById('sc-header'), {
				'margin-right': this.getScrollbarWidth()
			});
		},
		pageScrollbarEnable () {
			css(document.documentElement, {
				'overflow': ''
			});
			css(document.body, {
				'overflow-y': ''
			});
			css(document.getElementById('sc-header'), {
				'margin-right': ''
			});
		},
		getScrollbarWidth (recalculate) {
			let div1, div2, scrollbarWidth;
			if (recalculate == null) {
				recalculate = false;
			}
			if (document.readyState === 'loading') {
				return null;
			}
			div1 = document.createElement('div');
			div2 = document.createElement('div');
			div1.style.width = div2.style.width = div1.style.height = div2.style.height = '100px';
			div1.style.overflow = 'scroll';
			div2.style.overflow = 'hidden';
			document.body.appendChild(div1);
			document.body.appendChild(div2);
			scrollbarWidth = Math.abs(div1.scrollHeight - div2.scrollHeight);
			document.body.removeChild(div1);
			document.body.removeChild(div2);
			return scrollbarWidth;
		},
	}
});
