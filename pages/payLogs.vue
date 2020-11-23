<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <PayLogList/>
                </div>
                <div class="uk-width-1-3@l">
                    <PayLogDetail/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PayLogList from "@/components/payLog/payLogList"
import PayLogDetail from "@/components/payLog/payLogDetail"

export default {
    middleware: ['auth'],
    components: {
        PayLogList,
        PayLogDetail
    }
}
</script>

<style scoped>

</style>
