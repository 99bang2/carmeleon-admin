<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-creation"/>
								{{ userName ? userName+'님의 즐겨찾기 목록': '즐겨찾기 목록' }}
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
							<car-wash-favorite></car-wash-favorite>
						</li>
						<li>
							<gas-station-favorite></gas-station-favorite>
						</li>
						<li>
							<ev-charge-favorite></ev-charge-favorite>
						</li>
					</ul>
				</ScCardBody>


			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"
	import EvChargeFavorite from "@/components/user/UserFavoriteView/EvChargeFavorite"
	import CarWashFavorite from "@/components/user/UserFavoriteView/CarWashFavorite";
	import GasStationFavorite from "@/components/user/UserFavoriteView/GasStationFavorite";

	export default {
		components: {CarWashFavorite, GasStationFavorite, EvChargeFavorite},
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
					rowHeight: 45,
					getRowStyle: this.getRowStyle
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
						headerName: '주차장 유형',
						field: 'parkingSite.siteType',
						width: 90,
						cellRenderer: (obj) => {
							if (obj.data) {
								let badge = ''
								let typeName = ''
								switch (obj.value) {
									case 0 :
										badge = 'md-bg-green-500'
										typeName = '하이파킹'
										break
									case 1 :
										badge = 'md-bg-blue-500'
										typeName = '제휴'
										break
									case 2 :
										badge = 'md-bg-gray-500'
										typeName = '일반'
										break
								}
								return `<span class="uk-badge ${badge}">${typeName}</span>`
							}
						}
					},
					{
						headerName: '주차장 이름',
						field: 'parkingSite.name',
						width: 140
					},
					{
						headerName: '기준가격',
						field: 'parkingSite.price',
						width: 120,
						cellRenderer: (obj) => {
							return obj.value + ' 원'
						}
					},
					{
						headerName: '평점',
						field: 'parkingSite.rate',
						width: 120,
						filter: 'agNumberColumnFilter',
						cellRenderer: (obj) => {
							if (obj.value) {
								function roundToTwo(num) {
									return +(Math.round(num + "e+2") + "e-2");
								}

								let temp = ''
								if (obj.value > 8) {
									temp = '★★★★★'
								} else if (obj.value > 6 && obj.value <= 8) {
									temp = '★★★★'
								} else if (obj.value > 4 && obj.value <= 6) {
									temp = '★★★'
								} else if (obj.value > 2 && obj.value <= 4) {
									temp = '★★'
								} else {
									temp = '★'
								}
								return `<span>${temp} ${roundToTwo(obj.value)}</span>`;
							}
						}
					},
				]
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-favorite-list', (props) => {
				vm.fetchData(props.data.uid)
				this.targetUid = props.data.uid
				this.userName = props.data.nickname
			})
			this.$nuxt.$on('close-favorite-list', () => {
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () => {
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-favorite-list')
			this.$nuxt.$off('close-favorite-list')
			this.$nuxt.$off('close-all-list')
		},
		methods: {
			async fetchData(data) {
				this.cardFormClosed = false
				let res = await this.$axios.$get(this.config.apiUrl + '/favorites/' + data)
				console.log(this.config.apiUrl + '/favorites/' + data)
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
						this.$nuxt.$emit('open-gasStation-favorite', targetUid, targetType)
						break;
					case 2:
						this.$nuxt.$emit('open-carWash-favorite', targetUid, targetType)
						break;
					case 3:
						this.$nuxt.$emit('open-evCharge-favorite', targetUid, targetType)
						break;
				}
			}
		}
	}
</script>

<style scoped>

</style>
