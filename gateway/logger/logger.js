const { createLogger, format, transports } = require("winston")
const { combine, timestamp, json, colorize} = format

const consoleFormat = format.combine(
    format.colorize(),
    format.printf(({level, message, timestamp}) => {
        return `${level} : ${message}`
    })
)

const logger = createLogger({
    level:'info',
    format:combine(colorize(), timestamp(), json()),
    transports:[
        new transports.Console({
            format:consoleFormat
        }),
        new transports.File({filename:"gatewayLogs.log"})
    ]
})

module.exports = logger

