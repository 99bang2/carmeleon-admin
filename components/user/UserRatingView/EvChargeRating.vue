<!--<template>-->
<!--	<div>-->
<!--		<ag-grid-vue-->
<!--			style="width: 100%;"-->
<!--			class="ag-theme-material"-->
<!--			:dom-layout="'autoHeight'"-->
<!--			:locale-text="localeText"-->
<!--			:default-col-def="defaultColDef"-->
<!--			:column-defs="columnDefs"-->
<!--			:grid-options="gridOptions"-->
<!--			:pagination="true"-->
<!--			:pagination-page-size="10"-->
<!--			:framework-components="frameworkComponents"-->
<!--		></ag-grid-vue>-->
<!--	</div>-->
<!--</template>-->

<!--<script>-->
<!--	import {agGridMixin} from "~/plugins/ag-grid.mixin"-->
<!--	export default {-->
<!--		mixins: [-->
<!--			agGridMixin-->
<!--		],-->
<!--		data() {-->
<!--			return {-->
<!--				gridOptions: {-->
<!--					suppressRowClickSelection: true,-->
<!--					suppressMenuHide: true,-->
<!--					rowSelection: 'multiple',-->
<!--					onGridReady: this.onGridReady,-->
<!--					onFirstDataRendered: this.onFirstDataRendered,-->
<!--					getRowStyle: this.getRowStyle,-->
<!--					rowHeight: 45,-->
<!--				},-->
<!--cardFormClosed: true,-->
<!--			}-->
<!--		},-->
<!--		computed: {-->
<!--			columnDefs() {-->
<!--				return [-->
<!--					{-->
<!--						headerName: '장소명',-->
<!--						field: 'carWash.name',-->
<!--						width: 140-->
<!--					},-->
<!--					{-->
<!--						headerName: '평점',-->
<!--						field: 'rate',-->
<!--						width: 80,-->
<!--					},-->
<!--					{-->
<!--						headerName: '리뷰',-->
<!--						field: 'review',-->
<!--						width: 250-->
<!--					}-->
<!--				]-->
<!--			}-->
<!--		},-->
<!--		created() {-->
<!--			let vm = this-->
<!--			this.$nuxt.$on('open-carWash-rating', (uid) => {-->
<!--				vm.fetchData(uid)-->
<!--			})-->
<!--		},-->
<!--		methods:{-->
<!--			async fetchData(data) {-->
<!--				this.cardFormClosed = false-->
<!--				let res = await this.$axios.$get(this.config.apiUrl + '/rates/' + data)-->
<!--				this.gridOptions.api.setRowData(res.data)-->
<!--			},-->
<!--		}-->
<!--	}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
