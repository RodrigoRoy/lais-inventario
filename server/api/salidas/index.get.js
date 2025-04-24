export default defineEventHandler(async (event) => {
    return await $fetch(`${process.env.NOCODB_URL}/api/v2/tables/mxylas8z9l8ohr1/records`, {
        headers: {
            'xc-token': process.env.NOCODB_TOKEN
        },
        method: 'get',
    })
})
