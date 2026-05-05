const url = require('url');
const os = require('os');
const http = require("http");
const process = require("process");

// ---------- HELPERS ----------

function formatBytes(bytes, decimal = 2){
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes','KB','MB','GB','TB','PB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(decimal) + ' ' + sizes[i];
};

function formatTime(seconds){
    const days = Math.floor(seconds/(3600*24));
    const hours = Math.floor((seconds%(3600 * 24))/3600);
    const minutes = Math.floor((seconds %3600)/60);
    const remainingSeconds = Math.floor(seconds%60);
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

// ---------- INFO FUNCTIONS ----------

const getCpuInfo = ()=>{
    const cpus = os.cpus();
    return {
        model: cpus[0].model,
        cores: cpus.length,
        architecture: os.arch(),
        loadAvg: os.loadavg()
    };
};

const getMemoryInfo = () => {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
        total: formatBytes(total),
        free: formatBytes(free),
        used: formatBytes(used),
        usage: ((used / total) * 100).toFixed(2) + "%"
    };
};

const getOsInfo = () => {
    return {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        hostname: os.hostname(),
        uptime: formatTime(os.uptime())
    };
};

// ⚠️ sanitized (no sensitive info)
const getUserInfo = () => {
    const user = os.userInfo();
    return {
        username: user.username
    };
};

const getNetworkInfo = () => {
    const interfaces = os.networkInterfaces();
    return Object.fromEntries(
        Object.entries(interfaces).map(([name, addrs]) => [
            name,
            addrs.map(a => ({
                address: a.address,
                family: a.family,
                internal: a.internal
            }))
        ])
    );
};

const getProcessInfo = () => {
    const mem = process.memoryUsage();
    return {
        pid: process.pid,
        title: process.title,
        nodeVersion: process.version,
        cwd: process.cwd(),
        memoryUsage: {
            rss: formatBytes(mem.rss),
            heapTotal: formatBytes(mem.heapTotal),
            heapUsed: formatBytes(mem.heapUsed),
            external: formatBytes(mem.external)
        }
    };
};

// ---------- SERVER ----------

const server = http.createServer((req,res) => {
    const parsedUrl = url.parse(req.url, true);
    res.setHeader("Content-Type","application/json");

    if (parsedUrl.pathname === "/"){
        res.statusCode = 200;
        res.end(JSON.stringify({
            name: "SysView-System Info API",
            routes: ["/cpu","/memory","/os","/user","/process","/network"]
        }));
    } 
    else if(parsedUrl.pathname === '/cpu'){
        res.end(JSON.stringify(getCpuInfo(),null,2));
    } 
    else if(parsedUrl.pathname === '/memory'){
        res.end(JSON.stringify(getMemoryInfo(),null,2));
    } 
    else if(parsedUrl.pathname === '/os'){
        res.end(JSON.stringify(getOsInfo(),null,2));
    } 
    else if(parsedUrl.pathname === '/user'){
        res.end(JSON.stringify(getUserInfo(),null,2));
    } 
    else if(parsedUrl.pathname === '/process'){
        res.end(JSON.stringify(getProcessInfo(),null,2));
    } 
    else if(parsedUrl.pathname === '/network'){
        res.end(JSON.stringify(getNetworkInfo(),null,2));
    } 
    else{
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

// ---------- START ----------

const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`SysView running at http://localhost:${PORT}`);
});
// const url = require('url')
// const os = require('os')
// const http = require("http")
// const process = require("process")
// const { log } = require('console')

// //convert bytes to human readable format
// //convert seconds to human readable time

// // get cpu info
// //get os info
// // get memory info
// // get user info
// // get process info 
// // get network info

// //prepare the http server

// function formatBytes(bytes, decimal = 2){
//     if (bytes === 0) return "0 bytes"
//     //set base
//     const k = 1024
//     const sizes = ['bytes','KB','MB','GB','TB','PB']
//     const i = Math.floor(Math.log(bytes)/Math.log(k))
//     return parseFloat((bytes/Math.pow(k,i))).toFixed(decimal)+ ' ' + sizes[i]
// };


// function formatTime(seconds){
//     const days = Math.floor(seconds/(3600*24))
//     const hours = Math.floor((seconds%(3600 * 24))/3600)
//     const minutes = Math.floor((seconds %3600)/60)
//     const remainingSeconds = Math.floor(seconds%60)
//     return `${days}d ${hours}h ${minutes} ${remainingSeconds}`

// }
// // console.log(os.cpus()[0]);

// const getCpuInfo = ()=>{
//     const model = os.cpus()[0].model
//     const cores = os.cpus()[0].length
//     const architecture = os.arch();
//     const loadAvg = os.loadavg()
//     return{
//         model,cores,architecture,loadAvg
//     };
// };
// // console.log(getCpuInfo())


// const getMemoryInfo = () => {
//     const total = os.totalmem();
//     const free = os.freemem();
//     const used = total - free;

//     return {
//         total: formatBytes(total),
//         free: formatBytes(free),
//         used: formatBytes(used),
//         usage: ((used / total) * 100).toFixed(2) + "%"
//     };
// };

// // console.log(getMemoryInfo());

// const getOsInfo = () => {
//     const platform = os.platform()
//     const type = os.type()
//     const release = os.release()
//     const hostname = os.hostname()
//     const uptime = formatTime(os.uptime())
//     console.log(
//         {
//             platform, 
//             type,
//             release,
//             hostname,
//             uptime

//         }
//     )
// }
// // getOsInfo()

// const userInfo = () => {
//     const user = os.userInfo()
//     console.log(user)
// }
// // userInfo()

// const networkInfo = () => {
//     const network = os.networkInterfaces()
//     console.log(network)

// }
// // networkInfo()

// const processInfo = () => {
//     const pid = process.pid;
//     const title = process.title;
//     const nodeVersion = process.version;
//     console.log({
//         pid,
//         title,
//         nodeVersion
//     })
//     cwd: process.cwd();
//     memoryUsage: {
//         rss : formatBytes(process.memoryUsage().res)
//         heapTotal : formatBytes(process.memoryUsage().heapTotal)
//         heapUsed : formatBytes(process.memoryUsage().heapUsed)
//         external : formatBytes(process.memoryUsage().external)
//     }
//     env:{
//         NODE_ENV: process.env.NODE_ENV || "Node env not set";
//     }
// }
// // processInfo()

// //! HTTP SERVER

// const server = http.createServer((req,res) => {
//     const parsedUrl = url.parse(req.url, true);
//     res.setHeader("Content-Type","application/json");
//     if (parsedUrl.pathname === "/"){
//         res.statusCode = 200
//         res.end(JSON.stringify({
//             name: "SysView-System Info Api",
//             description: "Accessing the system stats via simple JSON routes",
//             routes: ["/cpu","/memory","/user","process","/network"]
//         }))
//     }else if(parsedUrl.pathname === '/cpu'){
//         res.end(JSON.stringify(getCpuInfo(),null,2));
//     }else if(parsedUrl.pathname === '/memory'){
//         res.end(JSON.stringify(getMemoryInfo(),null,2));
//     }else if(parsedUrl.pathname === '/user'){
//         res.end(JSON.stringify(userInfo,null,2));
//     }else if(parsedUrl.pathname === '/process'){
//         res.end(JSON.stringify(processInfo(),null,2));
//     }else{
//         res.statusCode = 404;
//         res.end(
//             JSON.stringify({
//                 error: "Route not found"
//             })
//         )
//     }
// });

// //! Start the server
// const PORT = 3000
// server.listen(PORT, ()=>{
//     console.log(`SysView is running at http://localhost:${PORT}`);
// }) 