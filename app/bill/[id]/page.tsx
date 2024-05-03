import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Bill() {
  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test bill</CardTitle>
            <CardDescription>
              Create a new bill and add participants to split the cost.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
