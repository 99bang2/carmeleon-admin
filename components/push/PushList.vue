<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-alarm-light"/> 푸시알림 목록</slot>
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
                    <div class="uk-width-2-5@s">
                        <div class="uk-grid-small uk-grid" data-uk-grid>
                            <a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
                               style="height:40px;" @click.prevent="refreshFilter">
                                <i class="mdi mdi-refresh"></i>
                            </a>
                            <div class="uk-width-1-3@s">
                                <select v-model="searchType" class="uk-select">
                                    <option value="">푸시알림 구분</option>
                                    <option value="1">개별 선택</option>
                                    <option value="2">전체</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-2-5@s">
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="푸시알림 검색">
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
                        :framework-components="frameworkComponents"
                >
                </ag-grid-vue>
            </ScCardBody>
        </ScCard>
    </div>
</template>

<script>
    import ScInput from '~/components/Input'
    import {agGridMixin} from "~/plugins/ag-grid.mixin"

    export default {
        components: {
            ScInput,
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
                searchType: '',
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
                        headerName: '분류',
                        field: 'pushType',
                        width: 100,
                        cellRenderer: (obj) => {
                            let typeName = ""
                            switch (obj.value) {
                                case 1:
                                    typeName = "개별 선택"
                                    break;
                                case 2:
                                    typeName = "전체"
                                    break;
                            }
                            return typeName
                        }
                    },
                    {
                        headerName: '제목',
                        field: 'title',
                        suppressSizeToFit: false,
                    },
                    {
                        headerName: '발송결과',
                        field: 'status',
                        width: 200,
                        cellRenderer: (obj) => {
                            return obj.value === 1 ? '<i class="mdi mdi-check-circle" style="font-size:8px;"></i>' : '아직 대기중입니다.'
                        }
                    },
                    {
                        headerName: '등록일시',
                        field: 'createdAt',
                        width: 160,
                        valueFormatter: obj => {
                            return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                        }
                    }
                ]
            }
        },
        watch: {
            'searchType': function (newValue) {
                let filterComponent = this.gridOptions.api.getFilterInstance('pushType')
                filterComponent.setModel({
                    type: 'equals',
                    filter: newValue
                })
                this.gridOptions.api.onFilterChanged()
            },
            'searchKeyword': function (newValue) {
                this.gridOptions.api.setQuickFilter(newValue)
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-push-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-push-list', () => {
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-push-list')
            this.$nuxt.$off('fetch-push-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            refreshFilter() {
                this.searchKeyword = ""
                this.searchType = ""
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-push-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-push-form', props)
                this.resetSelection()
                props.node.detail = true
                this.gridOptions.api.redrawRows()
            },
            async fetchData(selectUid) {
                //API 연동
                let res = await this.$axios.$get(this.config.apiUrl + '/pushes')
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(res.data)
                }
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
                        this.$axios.$post(this.config.apiUrl + '/pushes/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-push-form')
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
