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

const departmentNames = ["IT", "Civil", "Mechanical", "EP", "EC"];

export { genders, departments, roles, departmentNames };
