import { APP_LOGO_ICON } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';
import { t } from '@/lib/i18n';

interface FiscallyFitLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  iconProps?: LucideProps;
  hideText?: boolean;
}

export function FiscallyFitLogo({ className, iconProps, hideText = false, ...props }: FiscallyFitLogoProps) {
  const IconComponent = APP_LOGO_ICON;
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <IconComponent 
        className={cn("h-7 w-7 text-primary", iconProps?.className)} 
        strokeWidth={iconProps?.strokeWidth || 2}
      />
      {!hideText && <span className="text-xl font-semibold text-foreground">{t('appName')}</span>}
    </div>
  );
}
