import { FC } from 'react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default DashboardHeader;