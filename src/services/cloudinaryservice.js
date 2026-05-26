export const uploadImageToCloudinary = async (image) => {

  const formData = new FormData();

  formData.append("file", image);

  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  try {

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    return data.secure_url;

  } catch (error) {

    console.error(error);

    return null;
  }
};