export default function DLLogo({ size = 26 }) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size}
      alt="DiagnoLens"
      style={{ borderRadius: 7, flexShrink: 0, display: 'block' }}
    />
  );
}
