import http from 'http'
import fs  from 'fs';


// request each log to request in console
console.log(`[${new Date().toISOString()}] ${method} ${url}`);

const getAllFiles = () => {
    try {
        let allFiles = fs.readdirSync('.')
        return allFiles
    } catch (error) {
        return 'sorry some error caught' + error
    }
}

const server = http.createServer((req,res) => {
    
    const {url,method} = req

    if(url == '/' && method == 'GET'){
        res.writeHead(200,{'content-type': 'text/plain'});
        res.end("welcome to Node.js Server")
    }
    else if(url == '/time' && method == 'GET') {
        res.writeHead(200,{'content-type': 'application/json'})
        let now = new Date()
        const currentTime = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;   
       let response =  {statusCode: 200, message: currentTime}
        res.end(JSON.stringify(response))
    }
    else if(url == '/file' && method == 'GET'){
        res.writeHead(200,{'content-type': 'application/json'});
        
        let allFiles = getAllFiles()
        console.log(allFiles)
        res.end(JSON.stringify(allFiles))

        
    }
    else if (url == '/health' && method == 'GET'){
        res.writeHead(200, {'content-type': 'application/json'})
         const response = {
            statusCode: 200,
            status: "OK",
            message: "Server is running smoothly",
            uptime: process.uptime() + " seconds"
        };
        res.end(JSON.stringify(response))
    }
    else {
        res.writeHead(404, {'content-type': 'application/json'})
        res.end(JSON.stringify({
            'statusCode': 404,
            'message': 'page not found'
        }))
    }

})

server.listen(3000,() => {
    console.log(`server is listening on port 3000`)
})