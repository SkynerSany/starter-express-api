const generateId = () => Date.now()

const parseQuery = async (ctx, next) => {
  ctx.query.offset = (ctx.query.offset && parseInt(ctx.query.offset, 10)) || 0
  ctx.query.limit = (ctx.query.limit && parseInt(ctx.query.limit, 10)) || 10

  await next()
}

module.exports = {
  generateId,
  parseQuery,
}
