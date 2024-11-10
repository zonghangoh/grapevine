import LoginForm from '../components/authentication/LoginForm';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="mt-24 text-center flex-grow mx-auto max-w-6xl">
        <h1 className="text-6xl">
          Hear through the <span className="text-indigo-600">grapevine</span>.
        </h1>
        <div className="my-16 px-4 md:px-0">
          <LoginForm />
        </div>
      </div>
  </div>
  );
};

export default LandingPage;
