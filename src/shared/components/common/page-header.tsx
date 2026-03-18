type Props = {
  title: string;
  description?: string;
  button?: React.ReactNode;
};

function PageHeader({ title, description, button }: Props) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xl">
            {description}
          </p>
        )}
      </div>
      {button && <div className="shrink-0">{button}</div>}
    </div>
  );
}

export default PageHeader;
