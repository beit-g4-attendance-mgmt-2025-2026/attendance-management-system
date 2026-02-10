import { ZodError, ZodObject, ZodRawShape, ZodSchema } from "zod";

const validateBody = (
	body: unknown,
	schema: ZodObject<ZodRawShape> | ZodSchema,
	partial: boolean = false,
) => {
	if (schema instanceof ZodObject) {
		const validatedData = partial
			? schema.partial().safeParse(body)
			: schema.safeParse(body);
		if (!validatedData.success) {
			throw new ZodError(validatedData.error.issues);
		}
		return validatedData;
	} else {
		// Handle the case where schema is not a ZodObject
		throw new Error("Schema must be a ZodObject");
	}
};

export default validateBody;
