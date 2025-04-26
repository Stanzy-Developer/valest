import * as React from "react";
import { cn } from "@/lib/utils";

const Steps = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active: number;
  }
>(({ active, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-4", className)}
      data-active-step={active}
      {...props}
    />
  );
});
Steps.displayName = "Steps";

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center", className)} {...props} />
  );
});
Step.displayName = "Step";

const StepIndicatorWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center",
        className
      )}
      {...props}
    />
  );
});
StepIndicatorWrapper.displayName = "StepIndicatorWrapper";

const StepIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background",
        className
      )}
      {...props}
    />
  );
});
StepIndicator.displayName = "StepIndicator";

const StepTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-medium leading-none", className)}
      {...props}
    />
  );
});
StepTitle.displayName = "StepTitle";

const StepDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
StepDescription.displayName = "StepDescription";

interface StepsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  currentStep: number;
}

const StepsContent = React.forwardRef<HTMLDivElement, StepsContentProps>(
  ({ step, currentStep, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-4", step !== currentStep && "hidden", className)}
        {...props}
      />
    );
  }
);
StepsContent.displayName = "StepsContent";

export {
  Steps,
  Step,
  StepIndicator,
  StepIndicatorWrapper,
  StepTitle,
  StepDescription,
  StepsContent,
};
