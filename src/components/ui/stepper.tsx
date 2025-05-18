
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, activeStep, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const steps = childArray.map((step, index) => {
      return React.cloneElement(step as React.ReactElement, {
        isActive: index === activeStep,
        isCompleted: index < activeStep,
        stepNumber: index + 1,
      });
    });

    return (
      <div
        ref={ref}
        className={cn("flex w-full items-center", className)}
        {...props}
      >
        {steps}
      </div>
    );
  }
);
Stepper.displayName = "Stepper";

export interface StepItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  isCompleted?: boolean;
  stepNumber?: number;
}

const StepItem = React.forwardRef<HTMLDivElement, StepItemProps>(
  ({ className, children, isActive, isCompleted, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-1 items-center",
          isActive && "text-primary",
          className
        )}
        {...props}
      >
        {children}
        {/* Line connector for all but the last step */}
        {React.Children.count(children) > 0 &&
          React.isValidElement(children) &&
          React.Children.toArray(children)[0] && (
            <div className={cn("ml-2 h-0.5 flex-1", isCompleted ? "bg-primary" : "bg-muted")} />
          )}
      </div>
    );
  }
);
StepItem.displayName = "StepItem";

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background text-center font-medium",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Step.displayName = "Step";

const StepComplete = () => {
  return <CheckIcon className="h-5 w-5 text-background" />;
};
StepComplete.displayName = "StepComplete";

export interface StepTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const StepTitle = React.forwardRef<HTMLHeadingElement, StepTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-base font-semibold", className)}
        {...props}
      />
    );
  }
);
StepTitle.displayName = "StepTitle";

export interface StepDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const StepDescription = React.forwardRef<
  HTMLParagraphElement,
  StepDescriptionProps
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

export {
  Stepper,
  StepItem,
  Step,
  StepComplete,
  StepTitle,
  StepDescription,
};
