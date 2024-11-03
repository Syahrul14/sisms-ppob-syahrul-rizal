import React, { useState, useEffect } from "react";
import ProfilePhotoImage from "../../assets/ProfilePhoto.png"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const ProfilePhoto = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileName, setProfileName] = useState("Nama Profile");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token tidak tersedia, silakan login kembali.");
        return;
      }

      try {
        const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.status === 0) {
          const { first_name, last_name, profile_image } = data.data;
          setProfileName(`${first_name} ${last_name}`);
          setProfileImage(profile_image || ProfilePhotoImage);
        } else {
          setErrorMessage(data.message || "Gagal mengambil data profil.");
        }
      } catch (error) {
        setErrorMessage("Terjadi kesalahan saat mengambil data profil.");
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file && file.size <= 100 * 1024) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const token = localStorage.getItem("token");
          if (!token) {
            setErrorMessage("Token tidak tersedia, silakan login kembali.");
            return;
          }

          const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile/image", {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (response.ok && data.status === 0) {
            setProfileImage(data.data.profile_image);
          } else {
            setErrorMessage(data.message || "Gagal mengupdate gambar profil.");
          }
        } catch (error) {
          setErrorMessage("Terjadi kesalahan saat mengupdate gambar profil.");
        }
      } else {
        setErrorMessage("Format gambar tidak sesuai. Hanya jpeg dan png yang diperbolehkan.");
      }
    } else {
      setErrorMessage("Ukuran gambar melebihi 100 KB.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="relative w-24 h-24 rounded-full">
        <img
          src={profileImage || ProfilePhotoImage}
          alt="Profile Photo"
          className="rounded-full w-full h-full object-cover"
        />
        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer">
          <label>
            <FontAwesomeIcon icon={faPen} className="text-gray-600" />
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
      <p className="text-lg font-bold mt-4">{profileName}</p>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default ProfilePhoto;
