const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./index.js')
nocache('./index.js', module => console.log(`${module} is now updated!`))

const starts = async (confumods = new WAConnection()) => {
    confumods.logger.level = 'warn'
    confumods.version = [2, 2123, 8]
    confumods.browserDescription = [ 'confumodsgonz', 'Chrome', '3.0' ]
    console.log(banner.string)
    confumods.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color('Scanea el QR'))
    })

    fs.existsSync('./ConfuMods.json') && confumods.loadAuthInfo('./ConfuMods.json')
    confumods.on('connecting', () => {
        start('2', 'Conectando...')
    })
    confumods.on('open', () => {
        success('2', 'Conectado')
    })
    await confumods.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./ConfuMods.json', JSON.stringify(confumods.base64EncodedAuthInfo(), null, '\t'))

    confumods.on('chat-update', async (message) => {
        require('./index.js')(confumods, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
