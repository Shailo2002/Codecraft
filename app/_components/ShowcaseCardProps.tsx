import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, MessageCircle, RefreshCcw } from "lucide-react";
import { PromptDialog } from "./PromptDialog";

interface ShowcaseCardProps {
  title: string;
  previewImage: string; // must be an IMAGE URL
  link: string;
  websitePrompt: string;
}

export function ShowcaseCard({
  title,
  previewImage,
  link,
  websitePrompt,
}: ShowcaseCardProps) {
  return (
    <Card className="group relative h-48 overflow-hidden rounded-xl border bg-transparent p-0">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-start transition-all duration-300 group-hover:blur-sm group-hover:brightness-75"
        style={{ backgroundImage: `url("${previewImage}")` }}
      />

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Actions */}
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button asChild variant="secondary">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </a>
        </Button>

        {/* <Button variant="default">
          <MessageCircle className="mr-2 h-4 w-4" />
          Prompt
        </Button> */}

        <PromptDialog websitePrompt={websitePrompt} />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/60 p-2 text-sm text-white">
        {title}
      </div>
    </Card>
  );
}
