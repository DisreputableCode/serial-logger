const SerialPort = require('serialport')
const fs = require('fs')

const openAllPorts = async (baud) => {
    return new Promise(resolve => {
        var serialPorts = []
        SerialPort.list().then(ports => {
            ports.forEach((port) => {
                serialPorts.push(new SerialPort(port.path, {baudRate:baud}))
                resolve(serialPorts)
            })
        })
    })
}

const logFile = async () => {
    return new Promise(resolve => {
        const now = new Date()
        const fn = 'log ' + now.toISOString() + '.csv'
        var file = fs.createWriteStream(fn, {flags:'a'})
        resolve(file)
    })
}

const main = async () => {
    const log = await logFile()
    const ports = await openAllPorts(9600)

    ports.forEach((port) => {
        port.on('data', function (data) {
            const now = new Date()
            const line = now.toISOString() + ',' + port.path + ',' + data
            stream.write(line + '\n')
            console.log(line)
        })
        console.log("Listening to " + port.path)
    })
}

main()

