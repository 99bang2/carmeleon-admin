<template>
    <ScCard>
        <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
            <div class="uk-flex-1">
                <ScCardTitle>
                    <slot><i class="mdi mdi-comment-question-outline"/> 문의사항 목록</slot>
                </ScCardTitle>
            </div>
            <div class="uk-text-nowrap">
                <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
                   style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="삭제"/>
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
            />
        </ScCardBody>
    </ScCard>
</template>

<script>
    import {agGridMixin} from "@/plugins/ag-grid.mixin";

    export default {
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
                        headerName: '제목',
                        field: 'title',
                        suppressSizeToFit: false,
                    },
                    {
                        headerName: '분류',
                        field: 'categoryName',
                        width: 100
                    },
                    {
                        headerName: '작성자',
                        field: 'name',
                        width: 160
                    },
                    {
                        headerName: '이메일 주소',
                        field: 'email',
                        width: 200
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
        created() {
            let vm = this
            this.$nuxt.$on('reset-question-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-question-list', () => {
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-question-list')
            this.$nuxt.$off('fetch-question-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods:{
            async fetchData(selectUid) {
                let res = await this.$axios.$get(this.config.apiUrl + '/questions')
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(res.data)
                }
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-question-detail', props)
                this.resetSelection()
                props.node.detail = true
                this.gridOptions.api.redrawRows()
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
                        this.$axios.$post(this.config.apiUrl + '/questions/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-question-detail')
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