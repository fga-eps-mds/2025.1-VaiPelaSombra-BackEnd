import app from './app';

const PORT = parseInt(process.env.PORT || '3000');
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}/api-docs/`);
});
