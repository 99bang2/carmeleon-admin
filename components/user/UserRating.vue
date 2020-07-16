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
				<ScCardBody>
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
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"

	export default {
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
				userName:''
			}
		},
		computed: {
			columnDefs() {
				return [
					{
						headerName: '구분',
						field:'targetType',
						width: 80,
						cellRenderer: (obj)=>{
							let icon=''
							console.log
							switch (obj.value) {
								case 0:
									icon='mdi-parking'
									break;
								case 1:
									icon='mdi-car-wash'
									break;
								case 2:
									icon='mdi-gas-station'
									break;
								case 3:
									icon='mdi-battery-charging'
									break
							}
							return `<i class="mdi ${icon}"/>`
						}
					},
					{
						headerName: '장소명',
						field: 'parkingSite.name',
						width: 120
					},
					{
						headerName: '평점',
						field: 'rate',
						width: 50,
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
				this.gridOptions.api.setRowData(res.data)
			},
			closeForm() {
				this.cardFormClosed = true
				this.$nuxt.$emit('reset-user-list')
			}
		}
	}
</script>

<style scoped>

</style>
