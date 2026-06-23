import {
  TrendingUp, Lock, AlignLeft, ArrowLeftRight, Scale, Percent, Timer, Fuel,
  QrCode, FileText, Fingerprint, Apple, FileDown, Image, ScrollText, Home,
  DollarSign, Palette, Cake, Type, Clock, FileSignature, Tag, Mail, Ruler,
  Building2, ImageDown, FileUp, Zap, PiggyBank, Search
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

type CategoryColor = {
  bg: string;
  text: string;
  border: string;
};

type ToolIconConfig = {
  icon: LucideIcon;
  category: CategoryColor;
};

const CATEGORIES = {
  calculadora: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  gerador: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  conversor: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  pdf: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  utilidade: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
} as const;

export const toolIcons: Record<string, ToolIconConfig> = {
  "calculadora-juros-compostos": { icon: TrendingUp, category: CATEGORIES.calculadora },
  "gerador-de-senha": { icon: Lock, category: CATEGORIES.gerador },
  "contador-de-caracteres": { icon: AlignLeft, category: CATEGORIES.utilidade },
  "conversor-de-unidades": { icon: ArrowLeftRight, category: CATEGORIES.conversor },
  "calculadora-imc": { icon: Scale, category: CATEGORIES.calculadora },
  "calculadora-porcentagem": { icon: Percent, category: CATEGORIES.calculadora },
  "cronometro": { icon: Timer, category: CATEGORIES.utilidade },
  "calculadora-combustivel": { icon: Fuel, category: CATEGORIES.calculadora },
  "gerador-qr-code": { icon: QrCode, category: CATEGORIES.gerador },
  "calculadora-rescisao": { icon: FileText, category: CATEGORIES.calculadora },
  "gerador-cpf-cnpj": { icon: Fingerprint, category: CATEGORIES.gerador },
  "calculadora-calorias": { icon: Apple, category: CATEGORIES.calculadora },
  "juntar-pdf": { icon: FileDown, category: CATEGORIES.pdf },
  "imagem-para-pdf": { icon: Image, category: CATEGORIES.pdf },
  "gerador-lorem-ipsum": { icon: ScrollText, category: CATEGORIES.gerador },
  "calculadora-financiamento": { icon: Home, category: CATEGORIES.calculadora },
  "conversor-moedas": { icon: DollarSign, category: CATEGORIES.conversor },
  "gerador-cores": { icon: Palette, category: CATEGORIES.gerador },
  "calculadora-idade": { icon: Cake, category: CATEGORIES.calculadora },
  "conversor-texto": { icon: Type, category: CATEGORIES.conversor },
  "calculadora-horas": { icon: Clock, category: CATEGORIES.calculadora },
  "gerador-contrato": { icon: FileSignature, category: CATEGORIES.gerador },
  "calculadora-desconto": { icon: Tag, category: CATEGORIES.calculadora },
  "validador-email": { icon: Mail, category: CATEGORIES.utilidade },
  "tabela-medidas": { icon: Ruler, category: CATEGORIES.utilidade },
  "consulta-cnpj": { icon: Building2, category: CATEGORIES.utilidade },
  "conversor-word-pdf": { icon: FileUp, category: CATEGORIES.pdf },
  "compressor-imagem": { icon: ImageDown, category: CATEGORIES.utilidade },
  "gerador-pix": { icon: Zap, category: CATEGORIES.gerador },
  "calculadora-investimentos": { icon: PiggyBank, category: CATEGORIES.calculadora },
};

export function getToolIcon(slug: string): ToolIconConfig {
  return toolIcons[slug] || { icon: Search, category: CATEGORIES.utilidade };
}

export { CATEGORIES };
