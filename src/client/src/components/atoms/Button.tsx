import { Button as TButton } from "@material-tailwind/react";

export interface Props {
  children: any;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "button";
}

const Button: React.FC<Props> = ({
  type = "button",
  children,
  className = "",
  onClick,
}) => {
  return (
    <TButton
      type={type}
      onClick={onClick}
      ripple
      className={
        "bg-primaryHover text-sm tracking-wider font-roboto " + className
      }
    >
      {children}
    </TButton>
  );
};

export default Button;
