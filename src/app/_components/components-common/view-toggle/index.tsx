import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";

interface ViewToggleProps {
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
}) => {
  const commonClass = "cursor-pointer md:size-[30px] size-6";

  return (
    <div className="flex gap-2 items-center">
      <PiListChecksLight
        className={`${commonClass} ${
          viewMode === "table" ? "text-blue-600" : "text-gray-400"
        }`}
        onClick={() => setViewMode("table")}
      />
      <IoGridOutline
        className={`${commonClass} ${
          viewMode === "card" ? "text-blue-600" : "text-gray-400"
        }`}
        onClick={() => setViewMode("card")}
      />
    </div>
  );
};
