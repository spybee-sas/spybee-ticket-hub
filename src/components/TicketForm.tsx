
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TicketCategory } from "@/types/ticket";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  project: z.string().min(1, "Project name is required."),
  category: z.enum(["Bug", "Complaint", "Delivery Issue", "Other"]),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

type TicketFormValues = z.infer<typeof formSchema>;

interface TicketFormProps {
  onSubmitSuccess?: (data: TicketFormValues & { files: File[] }) => void;
}

const TicketForm = ({ onSubmitSuccess }: TicketFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language } = useLanguage();

  // Custom error messages based on language
  const getErrorMessages = () => {
    if (language === 'es') {
      return {
        nameRequired: "El nombre debe tener al menos 2 caracteres.",
        emailInvalid: "Por favor proporcione una dirección de correo electrónico válida.",
        projectRequired: "El nombre del proyecto es requerido.",
        descriptionRequired: "La descripción debe tener al menos 10 caracteres."
      };
    }
    return {
      nameRequired: "Name must be at least 2 characters.",
      emailInvalid: "Please provide a valid email address.",
      projectRequired: "Project name is required.",
      descriptionRequired: "Description must be at least 10 characters."
    };
  };

  const errorMessages = getErrorMessages();

  // Update form schema with translated error messages
  const getFormSchema = () => z.object({
    name: z.string().min(2, errorMessages.nameRequired),
    email: z.string().email(errorMessages.emailInvalid),
    project: z.string().min(1, errorMessages.projectRequired),
    category: z.enum(["Bug", "Complaint", "Delivery Issue", "Other"]),
    description: z.string().min(10, errorMessages.descriptionRequired),
  });

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      name: "",
      email: "",
      project: "",
      category: "Bug" as TicketCategory,
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: TicketFormValues) => {
    setIsSubmitting(true);
    
    if (onSubmitSuccess) {
      onSubmitSuccess({ ...data, files });
      return;
    }
    
    // Simulate API call if no onSubmitSuccess is provided
    setTimeout(() => {
      toast.success(t('ticket.submitSuccess'), {
        description: `${t('ticket.id')}: T-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      
      // Reset form
      form.reset();
      setFiles([]);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ticket.fullName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('ticket.fullNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ticket.email')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t('ticket.emailPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ticket.projectName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('ticket.projectNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ticket.category')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('ticket.selectCategory')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bug">{t('ticket.categoryBug')}</SelectItem>
                    <SelectItem value="Complaint">{t('ticket.categoryComplaint')}</SelectItem>
                    <SelectItem value="Delivery Issue">{t('ticket.categoryDelivery')}</SelectItem>
                    <SelectItem value="Other">{t('ticket.categoryOther')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ticket.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('ticket.descriptionPlaceholder')}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>{t('ticket.attachments')}</FormLabel>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="max-w-sm"
            />
            <span className="text-sm text-muted-foreground">
              {files.length} {files.length === 1 ? t('ticket.file') : t('ticket.files')}
            </span>
          </div>

          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span className="text-sm truncate max-w-[200px] md:max-w-[400px]">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    {t('ticket.remove')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-spybee-yellow hover:bg-amber-400 text-spybee-dark font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('ticket.submitting') : t('ticket.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
