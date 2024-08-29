interface OAuthLoginButtonProps {
  provider: string;
  logo: string;
  onClick: () => void;
}

export default function OAuthLoginButton({
  provider,
  logo,
  onClick,
}: OAuthLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-1 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:bg-gray-300 hover:opacity-90"
    >
      <img src={logo} alt={`${provider} logo`} className="h-8 w-8" />
    </button>
  );
}
