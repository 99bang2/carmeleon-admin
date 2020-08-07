<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-comment-text-outline"/>
								{{ userName ? userName+'님의 리뷰내역': '리뷰내역' }}
							</ScCardTitle>
						</div>
						<ScCardActions>
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px">
					<ul class="uk-child-width-expand" data-uk-tab>
						<li class="uk-active">
							<a href="javascript:void(0)">
								주차장
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="switchNewList(targetUid,1)">
								주유소
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="switchNewList(targetUid,2)">
								세차장
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="switchNewList(targetUid,3)">
								전기차충전소
							</a>
						</li>
					</ul>
					<ul class="uk-switcher">
						<li>
							<ag-grid-vue
								style="width: 100%;"
								class="ag-theme-material"
								:dom-layout="'autoHeight'"
								:locale-text="localeText"
								:default-col-def="defaultColDef"
								:column-defs="columnDefs"
								:grid-options="gridOptions"
								:pagination="true"
								:pagination-page-size="10"
								:framework-components="frameworkComponents"
							>
							</ag-grid-vue>
						</li>
						<li>
							<car-wash-rating></car-wash-rating>
						</li>
						<li>
							<gas-station-rating></gas-station-rating>
						</li>
						<li>
							<ev-charge-rating></ev-charge-rating>
						</li>
					</ul>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"
	import EvChargeRating from "@/components/user/UserRatingView/EvChargeRating"
	import CarWashRating from "@/components/user/UserRatingView/CarWashRating";
	import GasStationRating from "@/components/user/UserRatingView/GasStationRating";

	export default {
		components: {GasStationRating, CarWashRating, EvChargeRating},
		props: {
			mode: {
				type: String,
				default: 'list'
			}
		},
		mixins: [
			agGridMixin
		],
		data() {
			return {
				gridOptions: {
					suppressRowClickSelection: true,
					suppressMenuHide: true,
					rowSelection: 'multiple',
					onGridReady: this.onGridReady,
					onFirstDataRendered: this.onFirstDataRendered,
					getRowStyle: this.getRowStyle,
					rowHeight: 45,
				},
				cardFormClosed: true,
				userName: '',
				targetUid: '',
				targetType: ''
			}
		},
		computed: {
			columnDefs() {
				return [
					{
						headerName: '장소명',
						field: 'parkingSite.name',
						width: 140
					},
					{
						headerName: '평점',
						field: 'rate',
						width: 80,
					},
					{
						headerName: '리뷰',
						field: 'review',
						width: 250
					}
				]
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-rating-list', (props) => {
				vm.fetchData(props.data.uid)
				this.targetUid = props.data.uid
				this.userName = props.data.nickname
			})
			this.$nuxt.$on('close-rating-list', () => {
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () => {
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-rating-list')
			this.$nuxt.$off('close-rating-list')
			this.$nuxt.$off('close-all-list')
		},
		methods: {
			async fetchData(data) {
				this.cardFormClosed = false
				let res = await this.$axios.$get(this.config.apiUrl + '/rates/' + data)
				let result = res.data.filter(data => data.targetType === 0)
				this.gridOptions.api.setRowData(result)
			},
			closeForm() {
				this.cardFormClosed = true
				this.$nuxt.$emit('reset-user-list')
			},
			switchNewList(targetUid, targetType) {
				switch (targetType) {
					case 1:
						this.$nuxt.$emit('open-gasStation-rating', targetUid, targetType)
						break;
					case 2:
						this.$nuxt.$emit('open-carWash-rating', targetUid, targetType)
						break;
					case 3:
						this.$nuxt.$emit('open-evCharge-rating', targetUid, targetType)
						break;
				}
			}
		}
	}
</script>

<style scoped>

</style>
