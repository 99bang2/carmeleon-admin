import Vue from 'vue'

const storage_url = 'https://kr.object.ncloudstorage.com'
const region = 'kr-standard'
const access_key = 'oButzYTuNwaIrxsTmx0W'
const secret_key = '5vxKOkyvMHmboApyCzAmHLYYQnjr6JzjdNHFweyn'
const bucket_name = 'carmeleon'
const root_album_name = 'admin'


const moment = require('moment')


const AWS = require('aws-sdk')
const endpoint = new AWS.Endpoint(storage_url)
const S3 = new AWS.S3({
    endpoint,
    region,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key
    }
})


function getExtensionFileName(filename) {
    let _fileLen = filename.length;
    let _lastDot = filename.lastIndexOf('.');
    return filename.substring(_lastDot, _fileLen).toLowerCase();
}


const objectStorageApi = {
    async uploadFile(spotType, file, prefix) {
        let root = root_album_name + '/' + spotType + '/'
        let key = root + prefix + getExtensionFileName(file.name)
        let param = {
            Bucket: bucket_name,
            Key: key,
            Body: file,
            ACL: 'public-read',
            ContentType: file.type,
        }

        try {
            console.log(param)
            let pms = await S3.putObject(param).promise()
            return storage_url + '/' + bucket_name + pms.$response.request.httpRequest.path
        } catch (err) {
            console.log('upload file error')
            console.log(err)
            return false
        }

    },
    async deleteObject(key) {
        let param = {
            Bucket: bucket_name,
            Key: key
        }

        try {
            return await S3.deleteObject(param).promise()
        } catch (err) {
            console.log('delete object error')
            console.log(err)
            return false
        }
    },
}

const objectStoragePlugin = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    objectStorageApi: objectStorageApi,
                }
            }
        })
        Object.defineProperty(Vue.prototype, '$objectStorage', {
            get() {
                return this.$root.objectStorageApi
            },
        })
    }
}

Vue.use(objectStoragePlugin)
