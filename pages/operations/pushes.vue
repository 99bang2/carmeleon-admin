<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <PushList/>
                </div>
                <div class="uk-width-1-3@l">
                    <PushForm/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PushList from "@/components/push/PushList"
    import PushForm from "@/components/push/PushForm"

    export default {
        middleware: ['auth'],
        components: {
            PushList,
            PushForm,
        }
    }
</script>
