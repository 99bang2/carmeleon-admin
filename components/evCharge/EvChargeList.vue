<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-battery-charging"/> 전기차충전소 목록</slot>
                    </ScCardTitle>
                </div>
                <div class="uk-text-nowrap">
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block"
                       @click.prevent="openNewForm" data-uk-tooltip="추가"/>
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
                       style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="삭제"/>
                </div>
            </ScCardHeader>
            <ScCardBody>
                <div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
                    <div class="uk-width-3-5@s">
                        <div class="uk-grid-small uk-grid" data-uk-grid>
                            <a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
                               style="height:40px;" @click.prevent="refreshFilter">
                                <i class="mdi mdi-refresh"></i>
                            </a>
                            <div class="uk-width-1-4@s">
                                <select v-model="searchChargeType" class="uk-select">
                                    <option value="">충전기타입</option>
                                    <option value="01">DC 차데모</option>
                                    <option value="02">AC 완속</option>
                                    <option value="03">DC 차데모+AC 3상</option>
                                    <option value="04">DC 콤보</option>
                                    <option value="05">DC 차데모+DC 콤보</option>
                                    <option value="06">DC 차데모+AC 3상+DC 콤보</option>
                                    <option value="07">AC3상</option>
                                </select>
                            </div>
                            <div class="uk-width-1-4@s">
                                <select v-model="searchStat" class="uk-select">
                                    <option value="">충전기상태</option>
                                    <option value=1>통신이상</option>
                                    <option value=2>충전대기</option>
                                    <option value=3>충전중</option>
                                    <option value=4>운영중지</option>
                                    <option value=5>점검중</option>
                                    <option value=9>상태미확인</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-1-5@s">
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="충전소명 검색">
                            <span slot="icon" class="uk-form-icon" data-uk-icon="search"/>
                        </ScInput>
                    </div>
                </div>
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
                        :row-model-type="'infinite'"
                        :cache-overflow-size="10"
                        :cache-block-size="10"
                        :max-concurrent-datasource-requests="1"
                        :max-blocks-in-cache="10"
                        :framework-components="frameworkComponents"
                >
                </ag-grid-vue>
            </ScCardBody>
        </ScCard>
    </div>
</template>


<script>
    import {agGridMixin} from "@/plugins/ag-grid.mixin"
    import ScInput from '~/components/Input'

    export default {
        components: {
            ScInput
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
                    onCellClicked: this.onRowClicked,
                    rowHeight: 45,
                    getRowStyle: this.getRowStyle
                },
                searchChargeType: '',
                searchStat: '',
                searchKeyword: '',
            }
        },
        computed: {
            columnDefs() {
                return [
                    {
                        headerName: "",
                        field: "",
                        width: 50,
                        resizable: false,
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
                        checkboxSelection: true,
                        suppressMovable: true,
                        onCellClicked: false,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        headerName: '전기차충전소명',
                        field: 'statNm',
                        width: 170,
                    }, {
                        headerName: '충전기타입',
                        field: 'chgerType',
                        width: 200,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                let text = ''
                                switch (obj.value) {
                                    case '01':
                                        text = 'DC 차데모'
                                        break
                                    case '02':
                                        text = 'AC 완속'
                                        break
                                    case '03':
                                        text = 'DC 차데모+AC 3상'
                                        break
                                    case '04':
                                        text = 'DC 콤보'
                                        break
                                    case '05':
                                        text = 'DC 차데모+DC 콤보'
                                        break
                                    case '06':
                                        text = 'DC 차데모+AC 3상\n' +
                                                '+DC 콤보'
                                        break
                                    case '07':
                                        text = 'AC 3상'
                                        break
                                }
                                return text
                            }
                        }
                    }, {
                        headerName: '충전기상태',
                        field: 'stat',
                        width: 120,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                let text = ''
                                switch (obj.value) {
                                    case 1 :
                                        text = '통신이상'
                                        break
                                    case 2 :
                                        text = '충전대기'
                                        break
                                    case 3 :
                                        text = '충전중'
                                        break
                                    case 4 :
                                        text = '운영중지'
                                        break
                                    case 5:
                                        text = '점검중'
                                        break
                                    case 9:
                                        text = '상태미확인'
                                        break
                                }
                                return text
                            }
                        }
                    }, {
                        headerName: '위치정보',
                        field: 'addr',
                        width: 300
                    }, {
                        headerName: '등록일시',
                        field: 'createdAt',
                        width: 160,
                        valueFormatter: obj => {
                            return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                        }
                    },
                ]
            }
        },
        watch: {
            'searchChargeType': function (newValue) {
                this.fetchData()
            },
            'searchStat': function (newValue) {
                this.fetchData()
            },
            'searchKeyword': function (newValue) {
                this.fetchData()
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-evCharge-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-evCharge-list', (uid) => {
                vm.fetchData(uid)
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-evCharge-list')
            this.$nuxt.$off('fetch-evCharge-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            async onGridReady(params) {
                const updateData = async context => {
                    let dataSource = {
                        rowCount: null,
                        getRows: async (params) => {
                            let lastRow = -1
                            let order = []
                            for (let sort of params.sortModel) {
                                order.push([sort.colId, sort.sort])
                            }
                            let parameters = {
                                offset: params.startRow,
                                limit: params.endRow - params.startRow,
                                order: order
                            }
                            await context.$axios.$get(this.config.apiUrl + '/evChargeStations', {
                                params: {
                                    searchChargeType: context.searchChargeType,
                                    searchStat: context.searchStat,
                                    searchKeyword: context.searchKeyword,
                                    offset: parameters.offset,
                                    limit: parameters.limit,
                                    order: parameters.order,
                                }
                            }).then(response => {
                                let rowsThisPage = response.data.rows
                                lastRow = response.data.count
                                params.successCallback(rowsThisPage, lastRow)
                            })
                        }
                    }
                    params.api.setDatasource(dataSource)
                }
                updateData(this)
                let pageSize = params.api.gridOptionsWrapper.gridOptions.paginationPageSize
                let rowHeight = params.api.gridOptionsWrapper.gridOptions.rowHeight
                params.api.rowRenderer.rowContainers.body.eWrapper.style.minHeight = pageSize * rowHeight + 'px'
            },
            refreshFilter() {
                this.searchChargeType = ""
                this.searchStat = ""
                this.searchKeyword = ""
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-evCharge-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-evCharge-form', props)
                this.resetSelection()
                props.node.detail = true
                this.gridOptions.api.redrawRows()
            },
            closeForm() {
                this.gridOptions.api.forEachNode((node) => {
                    node.detail = false
                })
                this.cardFormClosed = true
                this.gridOptions.api.redrawRows()
            },
            async fetchData(selectUid) {
                this.gridOptions.api.onFilterChanged()
            },
            resetSelection() {
                this.gridOptions.api.forEachNode((node) => {
                    node.detail = false
                })
                this.gridOptions.api.redrawRows()
            },
            deleteDatas() {
                let selected = this.gridOptions.api.getSelectedRows()
                let selectedUids = selected.map(({uid}) => uid)
                let seletedCnt = selectedUids.length
                if (seletedCnt) {
                    UIkit.modal.confirm(`선택한 항목 : ${seletedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
                        this.$axios.$post(this.config.apiUrl + '/evChargeStations/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-evCharge-form')
                            this.fetchData()
                        })
                    })
                } else {
                    this.callAlertError('삭제할 항목을 선택해주세요.')
                }
            },
        }
    }
</script>

<style scoped>

</style>
