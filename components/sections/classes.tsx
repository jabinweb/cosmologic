import { Code, Calculator, FlaskRound as Flask } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const subjects = [
  { icon: <Code />, label: "Computer" },
  { icon: <Calculator />, label: "Maths" },
  { icon: <Flask />, label: "Science" }
];

export function ClassesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Classes Offered</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {subjects.map((subject, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-lg py-2 px-4 flex items-center gap-2"
            >
              {subject.icon}
              {subject.label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}