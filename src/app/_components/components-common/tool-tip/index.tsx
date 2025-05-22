import { Tooltip, ToolTipProvider } from "../../ui/tooltip/customTooltip";

interface IToolTipProps {
  children: React.ReactNode;
  content?: any;
  delayDuration?: number;
  position?: "left" | "top" | "right" | "bottom";
}
const ToolTip = ({
  children,
  content,
  delayDuration = 0,
  position = "bottom",
}: IToolTipProps) => {
  return (
    <ToolTipProvider delayDuration={delayDuration}>
      <Tooltip>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Content
          className="bg-white border z-[999] rounded-md w-full p-1 text-gray-500"
          side={position}
        >
          {content}
        </Tooltip.Content>
      </Tooltip>
    </ToolTipProvider>
  );
};

export default ToolTip;
