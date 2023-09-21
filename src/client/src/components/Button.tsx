export interface Props {
  text?: string;
  children?: any;
  color?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  uppercase?: boolean;
  onClick: () => void;
  id?: string;
  className?: string;
}

const Button: React.FC<Props> = ({
  text,
  children = text,
  color = "primary",
  type = "button",
  uppercase = false,
  onClick,
  className,
}) => {
  const mainClass = `tracking-widest hover:tracking-[0.2em] middle none center mr-3 rounded-lg bg-primaryHover py-3 px-6 text-xs font-bold uppercase text-white shadow-primaryHover transition-all hover:shadow-lg focus:opacity-[0.85] active:opacity-[0.85] ${
    color === "primary"
      ? "bg-primary"
      : color === "secondary"
      ? "bg-secondary"
      : ""
  } ${uppercase ? "uppercase " : ""} ${className}`;

  return (
    <button className={mainClass} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
