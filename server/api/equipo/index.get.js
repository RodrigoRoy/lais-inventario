export default defineEventHandler(async (event) => {
    return await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mcc4adsnscn92bb/records/`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
        // query: {
        //     limit: 100
        // }
    })
})