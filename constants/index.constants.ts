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

export {
	genders,
	departments,
	roles,
	acedamicYears,
	semesters,
	departmentNames,
};
