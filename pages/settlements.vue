<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-child-width-1-1@m" data-uk-grid>
				<div>
					<ScCard>
						<ScCardHeader separator>
							<div class="uk-flex uk-flex-middle">
								<i class="mdi mdi-file-chart uk-margin-medium-right"></i>
								<ScCardTitle>
									정산관리
								</ScCardTitle>
							</div>
						</ScCardHeader>
						<ScCardBody>
							<!-- 검색필터 -->
							<div class="sc-padding-medium sc-round sc-border md-bg-grey-100 uk-grid-small uk-grid" data-uk-grid>
								<SearchMenu :search-data="searchData" :search-keyword="true" @search="search"></SearchMenu>
							</div>
							<!-- -->

							<div style="height: 30px"></div>

							<!-- 검색기간 및 엑셀 버튼 버튼으로 바꾸기!!!! -->
							<div style="display: flex; justify-content: space-between;">
								<span class="uk-text-small"> 검색기간 : 2020-06-01 ~ 2020-06-07 </span>
								<div>
									<a href="javascript:void(0)" class="sc-button sc-button-flex" @click.prevent="exportData()">
										<i class="mdi mdi-file-excel sc-icon-28 uk-margin-mini-right"></i>
										엑셀다운로드
									</a>
									<!-- excel 다운로드 기능 추가 -->
								</div>
							</div>
							<!-- -->

							<div style="height: 10px"></div>

							<!-- 결산 table -->
							<div>
								<table class="uk-table">
									<thead>
										<tr>
											<th class="jb-th-1"></th>
											<th style="background-color: rgba(102,187,106,0.5); font-weight: bold">완료</th>
											<th style="background-color: rgba(244,143,177,0.5); font-weight: bold">취소</th>
											<th style="background-color: rgba(130,177,255,0.5); font-weight: bold">종합</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>금액</td>
											<td>51,593,150원</td>
											<td>2,124,800원</td>
											<td>53,717,950원</td>
										</tr>
										<tr>
											<td>건수</td>
											<td>6,959건</td>
											<td>325건</td>
											<td>7,284건</td>
										</tr>
									</tbody>
								</table>
							</div>
							<!-- -->

							<div style="height: 30px"></div>

							<!-- 총 검색내역 -->
							<span class="uk-text-middle">총 {{this.totalCount}}개의 결제내역 조회</span>
							<!-- -->

							<!-- 리스트 -->
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
							<!-- -->
						</ScCardBody>
					</ScCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {agGridMixin} from "@/plugins/ag-grid.mixin";
	// import Select2 from "@/components/Select2";
	import SearchMenu from "~/components/common/SearchMenu";
	import XLSX from 'xlsx'
    export default {
		components: {SearchMenu},
		mixins: [
			agGridMixin
		],
		data() {
			return {
				searchData: {
					searchDate: this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD')+' ~ '+this.$moment(new Date()).format('YYYY-MM-DD'),
					searchKeyword: '',
					searchStatus: '',
					searchParkingType: '',
					searchSite: '',
				},
				totalCount: null,
				gridOptions: {
					suppressRowClickSelection: true,
					suppressMenuHide: true,
					rowSelection: 'multiple',
					onGridReady: this.onGridReady,
					onFirstDataRendered: this.onFirstDataRendered,
					onCellClicked: this.onRowClicked,
					rowHeight: 45,
					getRowStyle: this.getRowStyle
				},
			}
		},
		computed: {
			columnDefs() {
				return [
					{
						headerName: '결제일시',
						field: 'createdAt',
						width: 200,
						valueFormatter: obj => {
							return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
						}
					},
					{
						headerName: '주차장명',
						field:'parkingSite.name',
						width: 200
					},
					{
						headerName: '예약자번호',
						field: 'phoneNumber',
						width: 190
					},
					{
						headerName: '차량번호',
						field: 'carNumber',
						width: 190
					},
					{
						headerName: '구매상품',
						field: 'discountTicket.ticketTitle',
						width: 190
					},
					{
						headerName: '입차예정시간',
						field: 'reserveTime',
						width: 195
					},
					{
						headerName: '정산금액',
						field: 'totalPrice',
						width: 190
					},
					{
						headerName: '결제상태',
						field: 'status',
						width: 190
					}
				]
			}
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			search() {
				this.fetchData(this.searchData)
			},
			async fetchData(searchData) {
				let res = await this.$axios.$get(this.config.apiUrl + '/payLogs',{
					params:{
						searchData: searchData
					}
				})
				this.gridOptions.api.setRowData(res.data.rows)
				this.totalCount = res.data.count
			},
			exportData(){
				let aoaData = [
					['결제일시', '주차장명', '예약자번호', '차량번호', '구매상품','입차예정시간','정산금액','결제상태'],
				]
				this.gridOptions.api.forEachNode((node) => {
					aoaData.push([
						node.data.createdAt,
						node.data.parkingSite.name,
						node.data.phoneNumber,
						node.data.carNumber,
						node.data.discountTicket.ticketTitle,
						node.data.reserveTime,
						node.data.totalPrice,
						node.data.status
					])
				})
				let sheet = XLSX.utils.aoa_to_sheet(aoaData)
				let wb = XLSX.utils.book_new()
				XLSX.utils.book_append_sheet(wb, sheet, `(할인) 차량별 통계 목록`)
				XLSX.writeFile(wb, `주차 정산관리 목록.xlsx`)
			}
		}
    }
</script>

<style scoped>
	table, th, td {
		border: 1px solid #bcbcbc;
		text-align: center;
	}
	table{
		table-layout: auto;
	}
	.jb-th-1{
		width: 80px;
	}
</style>
