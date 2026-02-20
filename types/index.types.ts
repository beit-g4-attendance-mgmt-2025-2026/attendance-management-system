import { Department, User } from "@/generated/prisma/client";

export interface Teacher {
	id: string;
	name: string;
	username: string;
	email: string;
	gender: string;
	department: string;
	position: string;
	dateOfBirth: string;
	phone: string;
}

export interface Student {
	id: string;
	name: string;
	student_id: string;
	email: string;
	gender: string;
	department: string;
	semester: string;
	dateOfBirth: string;
	phone: string;
}

export interface Subject {
	id: string;
	name: string;
	code: string;
	year: string;
	semester: string;
	teacher_name: string;
}

export interface DepartmentTableItem {
	id: string;
	name: string;
	symbol: string;
	logo: string | null;
	email: string | null;
	phone: string | null;
	head_of_department: string | null;
	teachers: number;
	students: number;
}

export interface TeacherProfileCardProps {
	teacher: Teacher | null;
}
export interface StudentProfileCardProps {
	student: Student | null;
}

export interface StudentsListTableProps {
	students: Student[];
	selectedStudent?: Student | null;
	onSelectStudent?: (student: Student) => void;
}

export interface TeachersListTableProps {
	teachers: Teacher[];
	selectedTeacher: Teacher | null;
	onSelectTeacher: (teacher: Teacher) => void;
}
export interface DepartmentsListTableProps {
	departments: Department[];
}

export interface SubjectListTableProps {
	subjects: Subject[];
}
