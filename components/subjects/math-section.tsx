"use client";

import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function MathSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="col-span-1"
    >
      <Card className="relative overflow-hidden group">
        <CardHeader>
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 w-fit mb-4">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl mb-2">Mathematics 🔢</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Badge>Algebra</Badge>
            <Badge>Geometry</Badge>
            <Badge>Numbers</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">What you'll learn:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Problem-solving skills</li>
              <li>Mental math tricks</li>
              <li>Fun math games</li>
            </ul>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
            Start Learning Math
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
