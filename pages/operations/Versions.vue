<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-3-3@l">
                    <VersionList/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VersionList from "@/components/version/VersionList"

    export default {
        middleware: ['auth'],
        components: {
            VersionList
        }
    }
</script>

<style scoped>

</style>
