<template>
	<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
		<div class="uk-width-3-4@s">
			<div class="uk-grid-small uk-grid" v-if="searchType==''" data-uk-grid>
				<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline" style="height:40px;" @click.prevent="fetchData">
					<i class="mdi mdi-refresh"></i>
				</a>
				<div class="uk-width-1-2@s">
					<ScInput id="sel_date" v-model="searchData.searchDate" v-flatpickr="dpRange" ref="rangePicker" placeholder="날짜 검색" mode="outline">
						<span slot="icon" class="uk-form-icon" data-uk-icon="calendar"></span>
					</ScInput>
				</div>
				<div class="uk-width-1-3@s">
					<div class="uk-margin">
						<div class="uk-button-group">
							<button class="sc-button" :class="{'uk-active': selectButton === 'today'}" @click.prevent="selectToday">
								오늘
							</button>
							<button class="sc-button" :class="{'uk-active': selectButton === 'week'}" @click.prevent="selectWeek">
								일주일
							</button>
							<button class="sc-button" :class="{'uk-active': selectButton === 'month'}" @click.prevent="selectMonth">
								한달
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-grid-small uk-grid" v-if="searchType=='month'" data-uk-grid>
				<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline" style="height:40px;" @click.prevent="fetchData">
					<i class="mdi mdi-refresh"></i>
				</a>
				<div class="uk-width-1-6@s">
					<select v-model="searchData.searchDate" class="uk-select">
						<option v-for="option in options" :key="option.value" :value="option.value">
							{{ option.text }}
						</option>
					</select>
				</div>
			</div>
			<div class="uk-grid-small uk-grid" v-if="searchType=='year'" data-uk-grid>
				<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline" style="height:40px;" @click.prevent="fetchData">
					<i class="mdi mdi-refresh"></i>
				</a>
			</div>
		</div>
		<div class="uk-width-1-4@s">
			<ScInput v-model="searchData.searchKeyword" v-if="searchKeyword" placeholder="검색">
				<span slot="icon" class="uk-form-icon" data-uk-icon="search"></span>
			</ScInput>
		</div>
	</div>
</template>

<script>
import ScInput from "~/components/Input";
import moment from "~/plugins/moment";
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index";
import { Korea } from "flatpickr/dist/l10n/ko.js";

if (process.client) {
	require("~/plugins/flatpickr");
}
export default {
	components: {
		ScInput
	},
	props: {
		searchData: {
			type: Object,
			default: function(){
				return {}
			}
		},
		searchType: {
			type: String,
			default: ''
		},
		searchKeyword: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			sites: [],
			siteOptions: [],
			selectButton: 'week',
			options: [
				{text: this.$moment(new Date()).format("YYYY"), value: this.$moment(new Date()).format("YYYY")},
				{text: this.$moment(new Date()).add(-1, 'years').format("YYYY"), value: this.$moment(new Date()).add(-1, 'years').format("YYYY")},
				{text: this.$moment(new Date()).add(-2, 'years').format("YYYY"), value: this.$moment(new Date()).add(-2, 'years').format("YYYY")},
				{text: this.$moment(new Date()).add(-3, 'years').format("YYYY"), value: this.$moment(new Date()).add(-3, 'years').format("YYYY")},
				{text: this.$moment(new Date()).add(-4, 'years').format("YYYY"), value: this.$moment(new Date()).add(-4, 'years').format("YYYY")},
			]
		}
    },
	computed: {
		dpRange () {
			return {
				mode: "range",
                plugins: [confirmDatePlugin],
				maxDate: this.$moment(new Date()).format("YYYY-MM-DD"),
				defaultDate: [this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')]
			}
		},
		dpMonth () {
			return {
				plugins: [new monthSelectPlugin({
					shorthand: true, //defaults to false
					dateFormat: "Y-m", //defaults to "F Y"
					altFormat: "Y-m", //defaults to "F Y"
				})]
			}
		},
	},
	watch: {
		'searchData.searchKeyword': function(new_value, old_value) {
			this.$emit('search')
		},
		'searchData.searchDate': function(new_value, old_value) {
			this.$emit('search')
		}
	},
	async mounted() {},
	methods: {
		initPicker(date){
			document.querySelector('#sel_date')._flatpickr.setDate(date)
		},
		selectToday(){
			this.selectButton = 'today'
			this.searchData.searchDate = this.$moment(new Date()).format('YYYY-MM-DD')
			this.initPicker(this.$moment(new Date()).format('YYYY-MM-DD'))
		},
		selectWeek(){
			this.selectButton = 'week'
			this.searchData.searchDate = this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD')+' ~ '+this.$moment(new Date()).format('YYYY-MM-DD')
			this.initPicker([this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')])
		},
		selectMonth(){
			this.selectButton = 'month'
			this.searchData.searchDate = this.$moment(new Date()).add(-1, 'months').format('YYYY-MM-DD')+' ~ '+this.$moment(new Date()).format('YYYY-MM-DD')
			this.initPicker([this.$moment(new Date()).add(-1, 'months').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')])
		},
		fetchData(){
			this.$emit('search')
		}
	}
}
</script>
<style>
	@import "flatpickr/dist/plugins/monthSelect/style.css";
	.uk-button-group > .sc-button{
		min-width: 75px;
	}
</style>
