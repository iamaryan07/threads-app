import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="flex w-full max-w-[430px] flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white">Threads</h1>

          <p className="mt-3 text-base text-gray-400">
            Create your account and start posting.
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-dark-2 border border-dark-4 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-dark-3 border border-dark-4 text-white hover:bg-dark-4",
              formButtonPrimary:
                "bg-primary-500 hover:bg-primary-600 text-white",
              footerActionText: "text-gray-400",
              footerActionLink: "text-primary-500",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-dark-3 border-dark-4 text-white",
            },
          }}
        />
      </div>
    </div>
  );
}
