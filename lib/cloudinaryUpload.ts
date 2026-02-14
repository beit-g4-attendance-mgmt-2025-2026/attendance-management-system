import cloudinary from "./cloudinary";

export async function uploadImageToCloudinary(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
}
