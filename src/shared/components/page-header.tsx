type Props = {
  title: string,
  description: string,
  button?: React.ReactNode
}

function PageHeader({ title, description, button }: Props) {
  return (
    <div className="flex flex-col gap-3  pb-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-base font-semibold tracking-tight md:text-lg">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="w-full md:w-auto">
        {button}
      </div>
    </div>
  )
}

export default PageHeader
