export default function postJson(postUrl: string, jsonValue: {}){
    return fetch(postUrl, {
        method: "POST", 
        body: JSON.stringify(jsonValue),
        headers: {
            "Content-Type": "application/json"
        }
    })  
}