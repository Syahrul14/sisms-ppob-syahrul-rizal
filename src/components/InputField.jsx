import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const InputField = ({ name, placeholder, type = 'text', value, onChange, icon, disabled = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    return (
        <div className="relative w-full mt-4">
            <FontAwesomeIcon
                icon={icon}
                className="absolute w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
                name={name}
                placeholder={placeholder}
                type={(name === 'password' || name === 'confirmPassword') && showPassword ? 'text' : type}
                value={value}
                onChange={onChange}
                disabled={disabled} 
                className={`border focus:outline-none focus:border-red-500 p-2 pl-12 rounded w-full ${disabled ? 'bg-white-200' : ''}`} 
            />
            {(name === 'password' || name === 'confirmPassword') && (
                <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    className="absolute w-5 right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                />
            )}
        </div>
    );
};

export default InputField;
