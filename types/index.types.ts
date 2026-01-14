export interface Teacher {
	id: string;
	name: string;
	username: string;
	email: string;
	gender: string;
	department: string;
	role: string;
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
export interface Department {
	id: string;
	name: string;
	head_of_department: string;
	email: string;
	phone: string;
	teachers: number | string;
	students: number | string;
}

export interface Subject {
	id: string;
	name: string;
	code: string;
	year: string;
	semester: string;
	teacher_name: string;
}

export interface TeacherProfileCardProps {
	teacher: Teacher | null;
}
export interface StudentProfileCardProps {
	student: Student | null;
}

export interface StudentsListTableProps {
	students: Student[];
	selectedStudent: Student | null;
	onSelectStudent: (student: Student) => void;
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
