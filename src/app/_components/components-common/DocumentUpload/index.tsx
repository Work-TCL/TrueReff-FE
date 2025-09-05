"use client";
import { toastMessage } from "@/lib/utils/toast-message";
import { BookText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
interface IFileUploadBoxProps {
    handleUploadFile: (file: any) => void;
    uploadedFile?: File | null;
}
export default function FileUploadBox({ handleUploadFile,uploadedFile }: IFileUploadBoxProps) {
    const translate = useTranslations();
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    useEffect(()=> {
        if(uploadedFile){
            setFile(uploadedFile);
        }
    },[uploadedFile])
    const handleFileSelect = (file: File) => {
        simulateUpload();
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (!allowedTypes.includes(file.type)) {
            toastMessage.info("Invalid file type. Only PDF, DOCX, XLSX allowed.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toastMessage.error("File too large. Max size is 10MB.");
            return;
        }

        setFile(file);
        handleUploadFile(file);
    };

    const simulateUpload = () => {
        setUploadProgress(0); // Reset before upload
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 110) {
                    clearInterval(interval);
                    return 110;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFileSelect(selectedFile);
    };

    return (
        <div className="w-full mx-auto">
            <div
                className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-gray-50 ${isDragging ? "border-blue bg-blue opacity-50" : "border-gray-300"
                    }`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    capture={false} 
                    accept=".pdf,.docx,.xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="text-gray-500">
                    <div className="flex justify-center mb-2"><BookText /></div>
                    <p className="font-medium">{translate("Drag_and_drop_files_to_upload")}</p>
                    <p className="text-sm">{translate("DOCX_XLSX_or_PDF_Max_file_size")}{"10MB"}</p>
                    <p className="my-2">{translate("or")}</p>
                    <Button
                        type="button"
                        className="px-4 py-2 text-white rounded hover:bg-blue-700 text-sm"
                        variant="secondary"
                        onClick={(e: any) => {
                            e.stopPropagation();
                            inputRef.current?.click();
                        }}
                    >
                        {translate("Browse_files")}
                    </Button>
                </div>
            </div>

            {(file) && (
                <div className="mt-6 bg-white border rounded-md p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-red-600"><BookText /></div>
                        <div>
                            <p className="text-sm font-medium">{file?.name}</p>
                            {/* <p className="text-xs text-gray-500">
                                Uploading... {((file?.size??0) / (1024 * 1024)).toFixed(1)}MB
                            </p> */}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setFile(null);
                            handleUploadFile(null);
                            setUploadProgress(0);
                            if (inputRef.current) {
                                inputRef.current.value = "";
                            }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ❌
                    </button>
                </div>
            )}

            {file && (uploadProgress > 0 && uploadProgress < 110) && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue opacity-50 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}
