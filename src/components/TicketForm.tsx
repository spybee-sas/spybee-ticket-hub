
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

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      project: "",
      category: "Bug",
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
    
    // Simulate API call
    setTimeout(() => {
      if (onSubmitSuccess) {
        onSubmitSuccess({ ...data, files });
      }
      
      toast.success("Ticket submitted successfully!", {
        description: `Ticket ID: T-${Math.floor(1000 + Math.random() * 9000)}`,
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
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
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Website Redesign" {...field} />
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
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Complaint">Complaint</SelectItem>
                    <SelectItem value="Delivery Issue">Delivery Issue</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your issue in detail..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Attachments (Optional)</FormLabel>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="max-w-sm"
            />
            <span className="text-sm text-muted-foreground">
              {files.length} {files.length === 1 ? "file" : "files"} selected
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
                    Remove
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
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
