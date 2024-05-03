import { Bill } from "@/app/api/bill/route";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getBaseUrl, getColorByIndex } from "@/lib/utils";

async function fetchBillData(id: string): Promise<Bill> {
  const res = await fetch(`${getBaseUrl()}/api/bill/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch bill data");
  }
  const { data }: { data: Bill } = await res.json();
  return data;
}
export default async function BillPage({ params }: { params: { id: string } }) {
  const data = await fetchBillData(params.id);
  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="mb-2">{data.bill_name}</CardTitle>
            <CardDescription className="flex flex-wrap gap-1">
              {data.participants.map((participant, index) => (
                <Avatar
                  className="h-8 w-8 text-white"
                  style={{ backgroundColor: `${getColorByIndex(index)}` }}
                  key={participant.id}
                >
                  {participant.name.slice(0, 1).toUpperCase()}
                </Avatar>
              ))}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
