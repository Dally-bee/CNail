import demo from "@/data/demo.v1.json";
import evidence from "@/data/evidence.v1.json";
import personas from "@/data/personas.v1.json";
import type { EvidenceRecord } from "@/lib/domain";
import CultureNailDemo from "./ui/CultureNailDemo";

export default function Home() {
  return <CultureNailDemo demo={demo} evidence={evidence as EvidenceRecord[]} personas={personas} />;
}
