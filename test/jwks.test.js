require('dotenv').config()
const JWKSPlugin = require('../lib/jwks')

const EXPIRED_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNkMjM0OTg4ZTNhYWU2N2FmYmMwMmNiMWM0MTQwYjNjZjk2ODJjYWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNzY2ODY1MTQ4MzM3LTBxc3B1NTQ5cWlsanQwZzJvN2ZtZjJtaTVrcXJjb3UwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNzY2ODY1MTQ4MzM3LTBxc3B1NTQ5cWlsanQwZzJvN2ZtZjJtaTVrcXJjb3UwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyMzUxMzI5NDQxMzI0MzY4MTEyIiwiaGQiOiJmdW5jbWF0aWMuY29tIiwiZW1haWwiOiJkYW5pZWxqeW9vQGZ1bmNtYXRpYy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNTc4MjM1Nzc5LCJleHAiOjE1NzgyMzkzNzksImp0aSI6IjI2N2IyZDA2YjdmMjYzNjMzYWI4NzBiYThmMWM2MmYzN2ZkOTk3OTMifQ.ACNLt23UwjJ-jyMbEtr4pmCyFh-_JmojZ_vbTRyoZGBhVKW3PBC55UPT7ziMLNXZuSD3yf49TtsvvICZzI3ZilEPo2HZRbNWhpd88XKkYjNP3-hMXXO48azl4wpTqhUx7MenkrukN2W0vawX0j9XSb-o3NZjaPCQzCJX5AIhRzCPz3TdKs2SMLhfslI7GnzHkuY8STS4iV8H28fDXvw9LdgRmg4afU6Vk12-NIAHy8s_s4jeWyXwNAEGhMmlKkRCkOiwKdV2QDhDRJUjqugJealnWMv3DDmOAm-OAg5u8fcNuLn0-o_O1BZYpulq9uCNWuh4wO8LJ69Du3UiQHB0Sg"
const INVALID_CREDENTIALS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5FTXdNakF5TXpnME9EWXhSVEUzTWpOQ05qazNNek13UmpZMU9FUkdSamMyUkVFelFrUkJSUSJ9.eyJnaXZlbl9uYW1lIjoiRGFuaWVsIEpoaW4iLCJmYW1pbHlfbmFtZSI6IllvbyIsIm5pY2tuYW1lIjoiZGFuaWVsanlvbyIsIm5hbWUiOiJEYW5pZWwgSmhpbiBZb28iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1MVW0ydnlZY0xUYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFDTS9BZk02ZDVTTkU0US9waG90by5qcGciLCJnZW5kZXIiOiJtYWxlIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAxOC0xMi0xMFQwNDoyODo0NS43MTlaIiwiZW1haWwiOiJkYW5pZWxqeW9vQGdvYWxib29rYXBwLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3N1cGVyc2hlZXRzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNzc2NDEzOTAwNDgyODczNzMyNiIsImF1ZCI6IlJrcFZldDlwem9yMmhaSjAxMkhoMXZwbnJBbFBxWm12IiwiaWF0IjoxNTQ0NDE4MDMxLCJleHAiOjE1NDQ0NTQwMzEsImF0X2hhc2giOiJsMXNFRC1JclBKbFdBNnhWMjNadVpRIiwibm9uY2UiOiJpSjd5UkN2VFZ2YkhLVnh1Wi1IVmUxMk9Kdmd2VjZhUCJ9.zPzNIR0DqvXDpqz7SYq0CwzYN2r6kIyc4J1Fn4DfGbKCluIj2wPuNo_oSDABgii5W7Pw4RI8eYgyq3Yga4urFNPjpS87Z9-4fQ0G00Q-2L4AtHihNqnyb0VjmzWkR1iKao3wYzOLTurrse1uwg4f8KTTDGsL5WRCdfiCd_GgK7kUuKiIRiRn7FfsvcS4eMidMt7wo2rBahBXvRAlwaOxWx6HN7J5TwlcAGkkJW2fc2nd3jXKpRk44l9ZDHQuhR-g63JPdJtSfScVP2JkvALTLW9lV_76lhHLPoR5B5DuVoyFurgePKVZLOropRcuc18BwsA99-gmaWbhfBPYBeO9ww"
const VALID_TOKEN = process.env['TEST_VALID_TOKEN']
const NOOP = () => { }

describe('Unauthorized Tokens', () => {
  let ctx = null
  let plugin = null
  beforeEach(async () => {
    ctx = {
      env: {
        JWKS_URI: process.env.JWKS_URI
      },
      event: { headers: { Authorization: '' } },
      state: { },
      logger: console
    }
    plugin = new JWKSPlugin()
    await plugin.start(ctx, NOOP)
  })
  it ('should deny when Authorization token is not given', async () => {
    ctx.event.headers['Authorization'] = ''
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: "No token provided"
    })
  })
  it ('should deny when Authorization token is malformed', async () => {
    ctx.event.headers['Authorization'] = 'BADTOKEN'
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: expect.stringMatching(/^Invalid token format/)
    })
  })
  it ('should deny an expired token', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${EXPIRED_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: "jwt expired"
    })
  })
  it ('should deny an invalid token', async () => {
    ctx.event.headers['Authorization'] =  `Bearer ${INVALID_CREDENTIALS_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toMatchObject({
      success: false,
      error: true,
      errorMessage: expect.stringMatching(/^Unable to find a signing key/)
    })
  })
})

describe('Skip Authentication', () => {
  let ctx = null
  let plugin = null
  beforeEach(async () => {
    ctx = {
      env: {
        JWKS_URI: process.env.JWKS_URI,
        JWKS_SKIP_VERIFICATION: 'true'
      },
      event: { headers: { Authorization: '' } },
      state: { },
      logger: console
    }
    plugin = new JWKSPlugin()
    await plugin.start(ctx, NOOP)
  })
  it ('should just decode the token without verifying with authorizer', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${EXPIRED_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: true,
      decoded: {
        iss: "accounts.google.com"
      }
    })
  })
  it ('should just noop if ctx.state.auth is already defined', async () => {
    ctx.state.auth = { success: true, decoded: { hello: "world" } } 
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toMatchObject({
      success: true,
      decoded: {
        hello: "world"
      }
    })
  })
})

describe('Valid Authentication', () => {
  let ctx = null
  let plugin = null
  let accesstoken = null
  let idtoken = null
  beforeEach(async () => {
    ctx = {
      env: {
        JWKS_URI: process.env.JWKS_URI,
        JWKS_SKIP_VERIFICATION: 'false'
      },
      event: { headers: { Authorization: '' } },
      state: { },
      logger: console
    }
    plugin = new JWKSPlugin()
    await plugin.start(ctx, NOOP)
  })
  it ('should decode a valid id token', async () => {
    ctx.event.headers['Authorization'] = `Bearer ${VALID_TOKEN}`
    await plugin.request(ctx, NOOP)
    expect(ctx.state.auth).toBeTruthy()
    expect(ctx.state.auth).toMatchObject({
      success: true,
      decoded: {
        iss: "accounts.google.com"
      }
    })
  })
})
