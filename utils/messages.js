export function generateMassages(username,text){
 return {
    username,
    text,
 createdAt : new Date()
 }
}

export function generatedLocationMessage(username, url){
    return {
        username,
        url,
        createdAt: new Date()
    }
}
