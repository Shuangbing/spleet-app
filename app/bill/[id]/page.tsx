import { Bill } from "@/app/api/bill/route";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBaseUrl } from "@/lib/utils";

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
            <CardTitle>{data.bill_name}</CardTitle>
            <CardDescription className="flex flex-wrap gap-1">
              {data.participants.map((participant) => (
                <Avatar className="h-8 w-8 border" key={participant.id}>
                  <AvatarFallback>
                    {participant.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
