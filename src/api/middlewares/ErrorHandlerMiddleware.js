export default function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  return res.status(status).send({ error: err.message });
}
