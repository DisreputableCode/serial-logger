const SerialPort = require('serialport')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))

class Log {
    constructor(fn='serial') {
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
    log.writeLine('logger starting')
    SerialPort.list().then(ports => {
        ports.forEach((port) => {
            const p = new SerialPort(port.path, {baudRate:baud}, (err) => {
                if (err) {
                    log.writeLine('unable to open port ' + port.path + ': ' + err)
                } else {
                    log.writeLine("opened port " + port.path)
                    p.on('data', function(data) {
                        log.writeLine(data.toString('hex'), port=p.path)
                    })
                }
            })
        })  
    })
}

main(argv.baud)
