
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionTooltip } from '../QuestionTooltip';
import { FormNavigation } from './FormNavigation';
import { type QuestionnaireFormValues } from '@/types/questionnaire';

interface InputMethodStepProps {
  formValues: QuestionnaireFormValues;
  onNext: () => void;
  onPrevious: () => void;
  onValueChange: (name: keyof QuestionnaireFormValues, value: string) => void;
}

export const InputMethodStep: React.FC<InputMethodStepProps> = ({
  formValues,
  onNext,
  onPrevious,
  onValueChange,
}) => {
  const form = useForm<{ method: string }>({
    defaultValues: {
      method: formValues.metodoEntrada || 'questionario',
    },
  });

  const handleNext = (data: { method: string }) => {
    onValueChange('metodoEntrada', data.method);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-lg font-semibold flex items-center">
                Como deseja fornecer as informações para a petição?
                <QuestionTooltip content="Escolha como você deseja fornecer as informações necessárias para gerar sua petição." />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <RadioGroupItem value="questionario" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Preencher questionário
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormNavigation 
          onPrevious={onPrevious}
          showPrevious={false}
          isLastStep={false}
        />
      </form>
    </Form>
  );
};
