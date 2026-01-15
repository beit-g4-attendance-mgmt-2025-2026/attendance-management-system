import { Department, Student, Teacher } from "@/types/index.types";

const genders = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
	{ label: "Other", value: "other" },
] as const;
const departments = [
	{ label: "Civil", value: "Civil" },
	{ label: "CEIT", value: "CEIT" },
	{ label: "EC", value: "EC" },
	{ label: "MP", value: "MP" },
	{ label: "EP", value: "EP" },
] as const;
const roles = [
	{ label: "Admin", value: "admin" },
	{ label: "Department", value: "department" },
	{ label: "Teacher", value: "teacher" },
] as const;
const acedamicYears = [
	{ label: "First Year", value: "first year" },
	{ label: "Second Year", value: "second year" },
	{ label: "Third Year", value: "third year" },
	{ label: "Fourth Year", value: "fourth year" },
	{ label: "Fifth Year", value: "fifth year" },
	{ label: "Sixth Year", value: "sixth year" },
];
const semesters = [
	{ label: "1st Semester", value: "first semester" },
	{ label: "2nd Semester", value: "second semester" },
];

const departmentNames = ["IT", "Civil", "Mechanical", "EP", "EC"];

const TEACHERS: Teacher[] = [
	{
		id: "1",
		name: "Jhon Doe",
		username: "john123",
		email: "john@email.com",
		gender: "Male",
		department: "IT",
		role: "Head of Department",
		dateOfBirth: "19/1/1992",
		phone: "+1-234-567-8900",
	},
	{
		id: "2",
		name: "Cody Fisher",
		username: "codyfisher001",
		email: "cody.fisher@email.com",
		gender: "Female",
		department: "Computer Engineering & Information ",
		role: "Teacher",
		dateOfBirth: "15/5/1988",
		phone: "+1-234-567-8901",
	},
	{
		id: "3",
		name: "Sarah Smith",
		username: "sarah.smith",
		email: "sarah@email.com",
		gender: "Female",
		department: "IT",
		role: "Teacher",
		dateOfBirth: "22/8/1990",
		phone: "+1-234-567-8902",
	},
	{
		id: "4",
		name: "Sarah Smith",
		username: "sarah.smith",
		email: "sarah@email.com",
		gender: "Female",
		department: "IT",
		role: "Teacher",
		dateOfBirth: "22/8/1990",
		phone: "+1-234-567-8902",
	},
];

const STUDENTS: Student[] = [
	{
		id: "1",
		name: "Jhon Doe",
		student_id: "III-IT-1",
		email: "john@email.com",
		gender: "Male",
		department: "IT",
		semester: "First Semester",
		dateOfBirth: "19/1/1992",
		phone: "+1-234-567-8900",
	},
	{
		id: "2",
		name: "Jane Smith",
		student_id: "III-IT-2",
		email: "johnsmith@email.com",
		gender: "Male",
		department: "IT",
		semester: "First Semester",
		dateOfBirth: "19/1/2003",
		phone: "+1-234-567-8900",
	},
	{
		id: "3",
		name: "Alice Johnson",
		student_id: "III-IT-4",
		email: "alice@email.com",
		gender: "Male",
		department: "IT",
		semester: "First Semester",
		dateOfBirth: "19/1/2000",
		phone: "+1-234-567-8900",
	},
	{
		id: "4",
		name: "Jhon Doe",
		student_id: "IV-IT-20",
		email: "john@email.com",
		gender: "Male",
		department: "IT",
		semester: "Second Semester",
		dateOfBirth: "19/1/2002",
		phone: "+1-234-567-8900",
	},
];

const DEPARTMENTS: Department[] = [
	{
		id: "dept-001",
		name: "Computer Engineering & Information Technology",
		head_of_department: "Dr. Alice Thorne",
		email: "ceit.head@university.edu",
		phone: "+1-555-0101",
		teachers: "30",
		students: 120,
	},
	{
		id: "dept-002",
		name: "Electrical & Electronics Engineering",
		head_of_department: "Dr. Robert Chen",
		email: "eee.head@university.edu",
		phone: "+1-555-0102",
		teachers: "30",
		students: 120,
	},
	{
		id: "dept-003",
		name: "Mechanical Engineering",
		head_of_department: "Prof. Sarah Jenkins",
		email: "me.head@university.edu",
		phone: "+1-555-0103",
		teachers: "30",
		students: 120,
	},
	{
		id: "dept-004",
		name: "Civil Engineering",
		head_of_department: "Dr. Michael Scott",
		email: "ce.head@university.edu",
		phone: "+1-555-0104",
		teachers: "30",
		students: 120,
	},
	{
		id: "dept-005",
		name: "Business Administration & Management",
		head_of_department: "Dr. Linda Zhao",
		email: "bam.head@university.edu",
		phone: "+1-555-0105",
		teachers: "30",
		students: 120,
	},
];

const SUBJECTS = [
	{
		id: "1",
		name: "Operating System",
		code: "IT-42033",
		year: "1",
		semester: "1",
		teacher_name: "John Doe",
	},
	{
		id: "2",
		name: "Data Structure",
		code: "IT-42034",
		year: "1",
		semester: "2",
		teacher_name: "Jane Smith",
	},
	{
		id: "3",
		name: "Database Management System",
		code: "IT-42035",
		year: "2",
		semester: "1",
		teacher_name: "Alice Johnson",
	},
	{
		id: "4",
		name: "Computer Networks",
		code: "IT-42036",
		year: "2",
		semester: "2",
		teacher_name: "Bob Brown",
	},
];

const teacher_name_for_form_select = [
	{ label: "John Doe", value: "John Doe" },
	{ label: "Jane Smith", value: "Jane Smith" },
	{ label: "Alice Johnson", value: "Alice Johnson" },
	{ label: "Bob Brown", value: "Bob Brown" },
];

export {
	genders,
	departments,
	roles,
	acedamicYears,
	semesters,
	departmentNames,
	TEACHERS,
	STUDENTS,
	DEPARTMENTS,
	SUBJECTS,
	teacher_name_for_form_select,
};
