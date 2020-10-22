const SerialPort = require('serialport')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2));

class Log {
    constructor(fn=undefined) {
        if (!fn) {
            const now = new Date()
            fn = now.toISOString()
        }
        fn += '.log.csv'
        this.stream = fs.createWriteStream(fn, {flags:'a'})
    }

    writeLine(msg, port='system', consoleLog=true) {
        const now = new Date()
        const line = now.toISOString() + ',' + port + ',' + msg
        this.stream.write(line + '\n')
        if (consoleLog) console.log(line)
    }
}

const main = async (baud=9600) => {
    const log = new Log()
    SerialPort.list().then(ports => {
        ports.forEach((port) => {
            const p = new SerialPort(port.path, {baudRate:baud}, (err) => {
                if (err) {
                    log.writeLine('Unable to open port ' + port.path)
                } else {
                    log.writeLine("Opened port " + port.path)
                    p.on('data', function (data) {
                        log.writeLine(port.path + ',' + data, port=port.path)
                    })
                }
            })
        })  
    })
}

main(argv.baud)

