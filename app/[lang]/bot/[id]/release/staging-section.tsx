import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function StagingSection() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-2xl font-semibold text-foreground">Staging</h2>
        <Badge
          variant="secondary"
          className="bg-primary/20 text-primary hover:bg-primary/30"
        >
          UPGRADE
        </Badge>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Learn how to use this setting to enable staging workflows in{" "}
        <a href="#" className="text-primary hover:underline">
          this article
        </a>
        .
      </p>

      <RadioGroup defaultValue="disable" className="space-y-4">
        <div className="flex items-start gap-3">
          <RadioGroupItem value="disable" id="disable" className="mt-0.5" />
          <div className="flex-1">
            <Label
              htmlFor="disable"
              className="cursor-pointer text-sm font-medium text-foreground"
            >
              Disable Staging
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Always deploy the latest version to all domains
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RadioGroupItem value="enable" id="enable" className="mt-0.5" />
          <div className="flex-1">
            <Label
              htmlFor="enable"
              className="cursor-pointer text-sm font-medium text-foreground"
            >
              Enable Staging
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Manually select a version for{" "}
              <a href="#" className="text-primary hover:underline">
                naseems.framer.website
              </a>
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
