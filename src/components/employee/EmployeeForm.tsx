
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Employee } from '@/services/employeeService';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  jobTitle: z.string().min(2, { message: 'Job title is required.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  phoneNumber: z.string().min(7, { message: 'Please enter a valid phone number.' })
    .regex(/^(\+91[\s]?)?[0-9]{10}$/, { message: 'Please enter a valid Indian phone number.' }),
  dateJoined: z.date({ required_error: 'Date joined is required.' }),
  salary: z.number().min(1, { message: 'Salary is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const departments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Support',
  'Human Resources',
  'Finance',
  'Legal',
  'Operations',
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      jobTitle: '',
      department: '',
      phoneNumber: '',
      dateJoined: new Date(),
      salary: 0,
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        email: employee.email,
        jobTitle: employee.jobTitle,
        department: employee.department,
        phoneNumber: employee.phoneNumber,
        dateJoined: new Date(employee.dateJoined),
        salary: employee.salary,
      });
    }
  }, [employee, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="bg-slate-800 text-white border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-primary">{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="grid gap-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Aditya Sharma" 
                        className="bg-slate-700 border-slate-600 focus-visible:ring-primary" 
                        {...field} 
                      />
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
                    <FormLabel className="text-slate-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="aditya.sharma@company.com" 
                        className="bg-slate-700 border-slate-600 focus-visible:ring-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Job Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Software Engineer" 
                        className="bg-slate-700 border-slate-600 focus-visible:ring-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 focus-visible:ring-primary text-white">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept} className="focus:bg-slate-700 focus:text-white">
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+91 9876543210" 
                        className="bg-slate-700 border-slate-600 focus-visible:ring-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Salary (₹)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <IndianRupee className="h-4 w-4" />
                        </span>
                        <Input 
                          type="number" 
                          placeholder="60,000" 
                          className="bg-slate-700 border-slate-600 focus-visible:ring-primary pl-10"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateJoined"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-slate-300">Date Joined</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600 text-white",
                              !field.value && "text-slate-400"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="bg-slate-800 text-white"
                          classNames={{
                            day_selected: "bg-primary text-primary-foreground",
                            day_today: "bg-slate-700 text-white",
                            day: "text-white hover:bg-slate-700",
                            caption: "text-white",
                            caption_label: "text-white",
                            nav_button: "bg-slate-700 text-white hover:bg-slate-600",
                            head_cell: "text-slate-400",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t border-slate-700 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EmployeeForm;
