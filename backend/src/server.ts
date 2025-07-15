import app from './app';

const PORT = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api-docs/`);
});
