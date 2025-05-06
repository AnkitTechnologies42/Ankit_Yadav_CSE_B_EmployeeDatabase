
import { toast } from 'sonner';

export interface Employee {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  phoneNumber: string;
  dateJoined: string;
  salary: number;
}

// Mock data for employees
let employees: Employee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    phoneNumber: '(555) 123-4567',
    dateJoined: '2021-03-15',
    salary: 80000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    jobTitle: 'Product Manager',
    department: 'Product',
    phoneNumber: '(555) 987-6543',
    dateJoined: '2020-07-22',
    salary: 95000,
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.johnson@company.com',
    jobTitle: 'UX Designer',
    department: 'Design',
    phoneNumber: '(555) 456-7890',
    dateJoined: '2022-01-10',
    salary: 75000,
  },
  {
    id: 4,
    name: 'Emily Williams',
    email: 'emily.williams@company.com',
    jobTitle: 'Marketing Specialist',
    department: 'Marketing',
    phoneNumber: '(555) 234-5678',
    dateJoined: '2021-11-05',
    salary: 70000,
  },
  {
    id: 5,
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    jobTitle: 'HR Manager',
    department: 'Human Resources',
    phoneNumber: '(555) 876-5432',
    dateJoined: '2019-09-18',
    salary: 85000,
  },
];

// Generate mock data for 50 employees
const generateMoreEmployees = () => {
  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Human Resources', 'Finance', 'Sales', 'Customer Support', 'Operations', 'Legal'];
  const jobTitles = {
    'Engineering': ['Software Engineer', 'QA Engineer', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer'],
    'Product': ['Product Manager', 'Product Owner', 'Business Analyst', 'Product Analyst'],
    'Design': ['UX Designer', 'UI Designer', 'Graphic Designer', 'Product Designer'],
    'Marketing': ['Marketing Specialist', 'Content Writer', 'SEO Specialist', 'Social Media Manager'],
    'Human Resources': ['HR Manager', 'Recruiter', 'HR Coordinator', 'Talent Acquisition Specialist'],
    'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'Payroll Specialist'],
    'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development Rep'],
    'Customer Support': ['Customer Support Rep', 'Customer Success Manager', 'Support Engineer', 'Support Lead'],
    'Operations': ['Operations Manager', 'Project Manager', 'Program Manager', 'Operations Analyst'],
    'Legal': ['Legal Counsel', 'Compliance Officer', 'Contract Specialist', 'Legal Assistant']
  };
  
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Ayaan', 'Atharva', 'Anaya', 'Anika', 'Saanvi', 'Aadhya', 'Pari', 'Diya', 'Myra', 'Kavya'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Shah', 'Reddy', 'Joshi', 'Chauhan', 'Nair', 'Mehta', 'Agarwal', 'Iyer', 'Malhotra'];
  
  const getRandomElement = (array: any[]) => array[Math.floor(Math.random() * array.length)];
  
  if (employees.length >= 50) return;
  
  const additionalEmployees = Array.from({ length: 50 - employees.length }, (_, i) => {
    const department = getRandomElement(departments);
    const jobTitle = getRandomElement(jobTitles[department as keyof typeof jobTitles]);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    
    // Random date between 2018-01-01 and now
    const startDate = new Date(2018, 0, 1);
    const endDate = new Date();
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const dateJoined = randomDate.toISOString().split('T')[0];
    
    // Random salary between 30,000 and 150,000 (in INR thousands)
    const baseSalary = Math.floor(Math.random() * 120) + 30;
    const salary = baseSalary * 1000;
    
    return {
      id: employees.length + i + 1,
      name,
      email,
      jobTitle,
      department,
      phoneNumber: `+91 ${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      dateJoined,
      salary,
    };
  });
  
  employees = [...employees, ...additionalEmployees];
};

// Initialize with 50 employees
generateMoreEmployees();

export const getEmployees = async (): Promise<Employee[]> => {
  // Simulating API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...employees]);
    }, 500);
  });
};

export const getEmployee = async (id: number): Promise<Employee | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const employee = employees.find((e) => e.id === id);
      resolve(employee);
    }, 300);
  });
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmployee = {
        ...employee,
        id: Math.max(0, ...employees.map((e) => e.id)) + 1,
      };
      employees = [...employees, newEmployee];
      toast.success('Employee added successfully');
      resolve(newEmployee);
    }, 500);
  });
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = employees.findIndex((e) => e.id === employee.id);
      if (index !== -1) {
        employees = [
          ...employees.slice(0, index),
          employee,
          ...employees.slice(index + 1),
        ];
        toast.success('Employee updated successfully');
        resolve(employee);
      } else {
        toast.error('Employee not found');
        reject(new Error('Employee not found'));
      }
    }, 500);
  });
};

export const deleteEmployee = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = employees.findIndex((e) => e.id === id);
      if (index !== -1) {
        employees = [
          ...employees.slice(0, index),
          ...employees.slice(index + 1),
        ];
        toast.success('Employee deleted successfully');
        resolve();
      } else {
        toast.error('Employee not found');
        reject(new Error('Employee not found'));
      }
    }, 500);
  });
};
