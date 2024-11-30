



export default class interConnection {
    async reqto() {
        let data = {}
        const rawResponse = await fetch(`${process.env.content}/interservice/`, {
            method: 'GET',
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        const response = await rawResponse.json()
        return response;
    }


    async resetCache() {
        const rawResponse = await fetch(`http://localhost:5005/interservice/reset-cache`, {
            method: 'PATCH',
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
        })

        const response = await rawResponse.json()
        return response;
    }
    
}