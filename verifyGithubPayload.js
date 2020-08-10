// this is copied from https://medium.com/@vampiire/how-to-verify-the-authenticity-of-a-github-apps-webhook-payload-8d63ccc81a24

const crypto = require('crypto');

const createComparisonSignature = (body) => {
    const hmac = crypto.createHmac('sha1', process.env.GITHUB_SIGNATURE);
    const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
    return `sha1=${self_signature}`; // shape in GitHub header
}

const compareSignatures = (signature, comparison_signature) => {
    const source = Buffer.from(signature);
    const comparison = Buffer.from(comparison_signature);
    return crypto.timingSafeEqual(source, comparison); // constant time comparison
}

const verifyGithubPayload = (req, res, next) => {
    const { headers, body } = req;

    const signature = headers['x-hub-signature'];
    const comparison_signature = createComparisonSignature(body);
    console.log(signature, comparison_signature)
    if (!compareSignatures(signature, comparison_signature)) {
        console.log("Mismatched signature, returning")
        return res.status(401).send('Mismatched signatures');
    }

    const { action, ...payload } = body;
    req.eventType = headers['x-github-event']; // one of: https://developer.github.com/v3/activity/events/types/ 
    req.action = action;
    req.payload = payload;
    next();
}

module.exports = verifyGithubPayload;