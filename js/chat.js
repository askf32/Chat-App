const socket = io()
        
    //     socket.on('count',(count)=>{
    //     console.log('Count Is been updated!', count)
        
    // })
    // document.querySelector('#increment').addEventListener('click',()=>{
    //     console.log('clicked')
    //     socket.emit('increment')
    // })
    socket.on('message',(message)=>{
        console.log(message)
    })

    document.querySelector('#message-form').addEventListener('submit',(e)=>{
    //const message = e.target.elements.message.value
        e.preventDefault()
        const message = document.getElementById('input').value
        socket.emit('sendmessage',message, (error)=>{
            if(error){
                return console.error(error)

            }
            console.log("Message Delivered")
        })
        
    })

    document.querySelector('#send-location').addEventListener('click',()=>{
        if(!navigator.geolocation){
            return alert('Geolocation is not supported by your browser')
        }
        const position = navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('sendlocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })

        })
        
    })