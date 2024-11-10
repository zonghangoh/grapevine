import app from './app';

const PORT = process.env.PORT as string;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
