import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TodoDateComponent = ({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) => {
  return (
    <label className="sm:text-lg md:text-xl">
      <h3 className="pb-2">Date:</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "sm:w-full md:w-[240px] justify-start text-left font-normal sm:text-lg md:text-xl h-[3.75rem]",
              !date && "text-muted-foreground",
            )}
          >
            <FaCalendarAlt className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </label>
  );
};

export default TodoDateComponent;
