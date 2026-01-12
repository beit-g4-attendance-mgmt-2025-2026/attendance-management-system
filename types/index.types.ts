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

export interface TeachersListTableProps {
	teachers: Teacher[];
	selectedTeacher: Teacher | null;
	onSelectTeacher: (teacher: Teacher) => void;
}

export interface TeacherProfileCardProps {
	teacher: Teacher | null;
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

export interface StudentProfileCardProps {
	student: Student | null;
}

export interface StudentsListTableProps {
	students: Student[];
	selectedStudent: Student | null;
	onSelectStudent: (student: Student) => void;
}
