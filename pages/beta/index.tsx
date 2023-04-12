import { SignUpFlow } from 'src/components/beta/sign-up-flow';

const BetaPage = () => {
  return (
    <div className="h-full w-full m-6">
      <div className="w-full h-full flex flex-col m-auto text-center justify-center">
        <div className="w-full my-4">
          <h2 className="text-2xl font-heading font-bold center w-full">Welcome to Flow</h2>
        </div>
        <div>
          <SignUpFlow />
        </div>
      </div>
    </div>
  );
};

export default BetaPage;
