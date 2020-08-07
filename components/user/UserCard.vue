<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 745px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                <i class="mdi mdi-credit-card"/>
                                {{ userName ? userName+'님의 카드정보': '카드정보' }}
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
                            style="width: 100%"
                            class="ag-theme-material"
                            :dom-layout="'autoHeight'"
                            :locale-text="localeText"
                            :default-col-def="defaultColDef"
                            :column-defs="columnDefs"
                            :grid-options="gridOptions"
                            :pagination="true"
                            :pagination-page-size="10"
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
        mixins: [
            agGridMixin
        ],
        props: {
            mode: {
                type: String,
                default: 'list'
            }
        },
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
                userName: ''
            }
        },
        computed: {
            columnDefs() {
                return [
                    {
                        headerName: '카드번호',
                        field: 'cardInfo.cardNumber',
                        width: 150
                    },
                    {
                        headerName: '사용자 닉네임',
                        field: 'nickname',
                        width: 120
                    },
                    {
                        headerName: '주사용여부',
                        field: 'isMain',
                        width: 180,
                        cellRenderer: (obj) => {
                            return obj.value ? '주사용카드' : '주사용카드가 아닙니다.'
                        }
                    }
                ]
            }
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-card-list', (props) => {
                vm.fetchData(props.data.uid)
                this.userName = props.data.nickname
            })
            this.$nuxt.$on('close-card-list', () => {
                vm.closeForm()
            })
            this.$nuxt.$on('close-all-list', () => {
                vm.closeForm()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('open-card-list')
            this.$nuxt.$off('close-card-list')
            this.$nuxt.$off('close-all-list')
        },
        methods: {
            async fetchData(data) {
                this.cardFormClosed = false
                let res = await this.$axios.$get(this.config.apiUrl + '/userCards/' + data)
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
