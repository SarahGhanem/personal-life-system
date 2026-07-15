import { Plus } from "lucide-react";
import { createEvent } from "@/lib/actions/events";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function EventForm({ monthId }: { monthId: string }) {
  return (
    <form action={createEvent} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <input type="hidden" name="monthId" value={monthId} />
      <Input name="title" placeholder="Event title" required className="col-span-2 sm:col-span-2" />
      <Input name="date" type="date" required />
      <Input name="time" type="time" />
      <Input name="notes" placeholder="Notes (optional)" className="col-span-2 sm:col-span-4" />
      <Button type="submit" className="col-span-2 flex items-center justify-center gap-1.5 sm:col-span-4">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add event
      </Button>
    </form>
  );
}
