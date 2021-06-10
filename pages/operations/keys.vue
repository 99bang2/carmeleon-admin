<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <KeyList/>
                </div>
                <div class="uk-width-1-3@l">
                    <KeyForm/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import KeyList from "@/components/key/KeyList"
    import KeyForm from "@/components/key/KeyForm"

    export default {
        middleware: ['auth'],
        components: {
            KeyList,
            KeyForm
        }
    }
</script>

<style scoped>

</style>
