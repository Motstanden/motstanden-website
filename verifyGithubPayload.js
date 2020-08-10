// this is copied from https://medium.com/@vampiire/how-to-verify-the-authenticity-of-a-github-apps-webhook-payload-8d63ccc81a24

const crypto = require('crypto');

const verifyGithubPayload = (req, res, next) => {
    const payload = JSON.stringify(req.body)
    if (!payload) {
        return next('Request body empty')
    }

    const sig = req.get('x-hub-signature') || ''
    const hmac = crypto.createHmac('sha1', secret)
    const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
    const checksum = Buffer.from(sig, 'utf8')
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {

        var message = `Request body digest (${digest}) did not match ${'x-hub-signature'} (${checksum})`
        console.log(message)
        return next(message)
    }

    console.log("Validated")
    return next()
}

module.exports = verifyGithubPayload;