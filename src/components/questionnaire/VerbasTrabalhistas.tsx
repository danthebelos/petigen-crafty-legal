
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues, verbasTrabalhistas } from "@/types/questionnaire";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface VerbasTrabalistasStepProps {
  form: UseFormReturn<FormValues>;
}

const VerbasTrabalistasStep = ({ form }: VerbasTrabalistasStepProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-zinc-900">Verbas e Pedidos Trabalhistas</h3>
      <p className="text-sm text-zinc-600 mb-4">
        Selecione todas as verbas e pedidos trabalhistas aplicáveis ao seu caso
      </p>
      
      <FormField
        control={form.control}
        name="verbasTrabalhistas"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-2">
              <FormControl>
                <div className="border rounded-md">
                  {verbasTrabalhistas.map((categoria) => (
                    <Accordion
                      key={categoria.id}
                      type="single"
                      collapsible
                      className="border-b last:border-b-0"
                      value={expandedCategories.includes(categoria.id) ? categoria.id : ""}
                    >
                      <AccordionItem value={categoria.id}>
                        <AccordionTrigger 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(categoria.id);
                          }}
                          className="px-4 py-3 hover:bg-zinc-50"
                        >
                          {categoria.label}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2">
                          <div className="space-y-2">
                            {categoria.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={item.id}
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), item.id]
                                      : (field.value || []).filter((value) => value !== item.id);
                                    
                                    field.onChange(updatedValue);
                                  }}
                                />
                                <label
                                  htmlFor={item.id}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default VerbasTrabalistasStep;
