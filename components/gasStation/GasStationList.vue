<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-gas-station"/> 주유소 목록</slot>
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
                                <select v-model="searchBrandCode" class="uk-select">
                                    <option value="">브랜드 분류</option>
                                    <option value="SKE">SK에너지</option>
                                    <option value="GSC">GS칼텍스</option>
                                    <option value="HDO">현대오일뱅크</option>
                                    <option value="SOL">S-OIL</option>
                                    <option value="RTO">자영알뜰</option>
                                    <option value="RTX">고속도로알뜰</option>
                                    <option value="NHO">농협알뜰</option>
                                    <option value="ETC">자가상표</option>
                                    <option value="E1G">E1</option>
                                    <option value="SKG">SK가스</option>
                                </select>
                            </div>
                            <div class="uk-width-1-4@s">
                                <select v-model="searchType" class="uk-select">
                                    <option value="">업종구분</option>
                                    <option value="N">주유소</option>
                                    <option value="Y">충전소</option>
                                    <option value="C">겸업</option>
                                </select>
                            </div>
                            <div class="uk-width-1-4@s">
                                <select v-model="searchKpetro" class="uk-select">
                                    <option value="">품질인증</option>
                                    <option value="1">인증</option>
                                    <option value="0">미인증</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-1-5@s">
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="주유소명 검색">
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
                searchBrandCode: '',
                searchType: '',
                searchKpetro: '',
                searchKeyword: '',
                resUid: 0
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
                        headerName: '주유소명',
                        field: 'gasStationName',
                        width: 180,
                    }, {
                        headerName: '브랜드',
                        field: 'brandCodeName',
                        width: 150,
                    }, {
                        headerName: '업종구분',
                        field: 'gasStationTypeName',
                        width: 150,
                    }, {
                        field: 'brandCode',
                        hide: true
                    }, {
                        field: 'gasStationType',
                        hide: true
                    }
                    , {
                        headerName: '품질인증여부',
                        field: 'isKpetro',
                        width: 150,
                        cellRenderer: (obj) => {
                            return obj.value ? '<span>인증</span>' : '<span>미인증</span>'
                        }
                    }, {
                        headerName: '전화번호',
                        field: 'tel',
                        width: 170
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
            'searchType': function (newValue) {
                this.fetchData()
            },
            'searchBrandCode': function (newValue) {
                this.fetchData()
            },
            'searchKpetro': function (newValue) {
                this.fetchData()
            },
            'searchKeyword': function (newValue) {
                this.fetchData()
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-gasStation-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-gasStation-list', (uid) => {
                this.resUid = uid
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-gasStation-list')
            this.$nuxt.$off('fetch-gasStation-list')
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
                            await context.$axios.$get(this.config.apiUrl + '/gasStations', {
                                params: {
                                    searchType: context.searchType,
                                    searchBrandCode: context.searchBrandCode,
                                    searchKpetro: context.searchKpetro,
                                    searchKeyword: context.searchKeyword,
                                    offset: parameters.offset,
                                    limit: parameters.limit,
                                    order: parameters.order,
                                }
                            }).then(response => {
                                let rowsThisPage = response.data.rows
                                lastRow = response.data.count
                                params.successCallback(rowsThisPage, lastRow)
                                if(context.resUid) {
                                    context.gridOptions.api.forEachNode((node) => {
                                        if(node.data.uid === context.resUid) {
                                            context.openNewForm({
                                                node: node,
                                                data: node.data
                                            })
                                        }
                                    })
                                }
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
                this.searchType = ""
                this.searchBrandCode = ""
                this.searchKpetro = ""
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-gasStation-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-gasStation-form', props)
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
            async fetchData() {
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
                        this.$axios.$post(this.config.apiUrl + '/gasStations/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-gasStation-form')
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
