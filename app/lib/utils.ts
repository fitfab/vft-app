import { Cloudinary } from "@cloudinary/url-gen";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodSchema } from "zod";

/**
 *
 * @param inputs Array of classes
 * @returns string return the string of merge classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cld = new Cloudinary({ cloud: { cloudName: "dcvxv60gw" } });

export type ValidateFormProps = {
  formData: FormData;
  schema: ZodSchema;
};
export async function validateForm({ formData, schema }: ValidateFormProps) {
  const bodyData = Object.fromEntries(formData);
  const result = schema.safeParse(bodyData);

  if (result.success) {
    return { data: result.data, errors: null };
  }

  const { error } = result;

  return {
    data: bodyData,
    errors: error.issues.reduce((acc, curr) => {
      const key = curr.path[0];
      acc[key] = curr.message;
      return acc;
    }, {}),
  };
}
