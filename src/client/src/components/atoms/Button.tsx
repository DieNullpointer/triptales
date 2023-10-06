import { Button as TButton } from "@material-tailwind/react";

export interface Props {
  children: any;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({ children, className = '', onClick}) => {
  return (
    <TButton onClick={onClick} ripple className={"bg-primaryHover text-sm tracking-wider font-roboto " + className}>
      {children}
    </TButton>
  );
};

export default Button;