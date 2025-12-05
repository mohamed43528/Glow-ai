export default function GlowButton({ children, onClick, type = "button", variant = "primary" }) {
  const classes =
    variant === "primary"
      ? "bg-glowBlue text-white px-4 py-2 rounded-lg hover:opacity-90"
      : "bg-glowSoft text-glowDark px-4 py-2 rounded-lg hover:bg-gray-200";

  return (
    <button onClick={onClick} type={type} className={classes}>
      {children}
    </button>
  );
}
