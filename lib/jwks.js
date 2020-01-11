const JWKSTokenVerifier = require('@funcmaticjs/jwks-token-verifier')

class JWKSPlugin {

  construtor() {
    this.verifier = null
    this.skip = false
  }

  async start(ctx, next) {
    if (!ctx.env.JWKS_URI) {
      throw new Error('JWKS_URI must be defined in ctx.env')
    }
    this.verifier = new JWKSTokenVerifier({ JWKS_URI: ctx.env.JWKS_URI })
    this.skip = (ctx.env.JWKS_SKIP_VERIFICATION === 'true')
    return await next()
  }

  async request(ctx, next) {
    if (ctx.state.auth) {
      return await next()
    }
    const token = stripBearer(ctx.event.headers['Authorization'])
    let auth = { }
    if (!token) {
      ctx.logger.debug("No token provided")
      auth = {
        success: false,
        t: Date.now(),
        error: true,
        errorMessage: "No token provided"
      }
    } else if (this.skip) {
      ctx.logger.debug("Token verification skipped")
      let decoded = null
      try {
        decoded = this.verifier.decode(token).payload
      } catch (err) {
        ctx.logger.debug(err.message)
      }
      auth = {
        success: true,
        t: Date.now(),
        decoded
      }
    } else {
      ctx.logger.debug(`Verifying token`)
      try {
        let decoded = await this.verifier.verify(token)
        auth = {
          success: true,
          t: Date.now(),
          decoded
        }
      } catch (err) {
        auth = {
          success: false,
          t: Date.now(),
          error: true,
          errorMessage: err.message
        }
      }
    }
    ctx.logger.debug(JSON.stringify(auth, null, 2))
    ctx.state.auth = auth
    await next()
  }
}

function stripBearer(Authorization) {
  if (Authorization && Authorization.startsWith('Bearer')) {
    return Authorization.split(' ')[1]
  }
  return Authorization
}

module.exports = JWKSPlugin