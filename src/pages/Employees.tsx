import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmployeeForm from '@/components/employee/EmployeeForm';
import {
  Employee,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/services/employeeService';
import { IndianRupee, Search, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Employees = () => {
  const location = useLocation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    // Check if there's a query parameter to add an employee
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'add') {
      handleAddEmployee();
      // Clear the URL without refreshing the page
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredEmployees(
        employees.filter((employee) => 
          employee.name.toLowerCase().includes(lowercasedSearch) ||
          employee.email.toLowerCase().includes(lowercasedSearch) ||
          employee.department.toLowerCase().includes(lowercasedSearch) ||
          employee.jobTitle.toLowerCase().includes(lowercasedSearch)
        )
      );
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      if (selectedEmployee) {
        // Update existing employee
        await updateEmployee({
          ...data,
          id: selectedEmployee.id,
          dateJoined: data.dateJoined.toISOString().split('T')[0],
        });
      } else {
        // Add new employee
        await createEmployee({
          ...data,
          dateJoined: data.dateJoined.toISOString().split('T')[0],
        });
      }
      
      loadEmployees();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employee information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Employee Management</h1>
        <Button onClick={handleAddEmployee} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Plus size={18} /> Add Employee
        </Button>
      </div>
      
      <Card className="mb-6 bg-slate-800 text-white border-slate-700">
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription className="text-slate-400">
            View, search, and manage all employees in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-md border border-slate-700">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Job Title</TableHead>
                  <TableHead className="text-slate-300">Department</TableHead>
                  <TableHead className="text-slate-300">Phone</TableHead>
                  <TableHead className="text-slate-300">Date Joined</TableHead>
                  <TableHead className="text-slate-300">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      <span>Salary</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-white">{employee.name}</TableCell>
                      <TableCell className="text-slate-300">{employee.email}</TableCell>
                      <TableCell className="text-slate-300">{employee.jobTitle}</TableCell>
                      <TableCell className="text-slate-300">{employee.department}</TableCell>
                      <TableCell className="text-slate-300">{employee.phoneNumber}</TableCell>
                      <TableCell className="text-slate-300">{employee.dateJoined}</TableCell>
                      <TableCell className="text-slate-300">
                        <span>₹{employee.salary.toLocaleString('en-IN')}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                            className="hover:bg-slate-700 text-slate-300"
                          >
                            Edit
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-800 text-white border-slate-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Are you sure you want to delete {employee.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                      {searchTerm
                        ? "No employees found matching your search."
                        : "No employees found. Add your first employee using the button above."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[720px] bg-slate-800 text-white border-slate-700">
          <EmployeeForm
            employee={selectedEmployee}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Employees;
